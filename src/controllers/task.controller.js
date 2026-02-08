const Task = require("../models/Task");
const { redisClient } = require("../config/redis");

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.userId,
    });

    // Invalidate all cached pages for this user
    const keys = await redisClient.keys(`tasks:${req.userId}:*`);
    if (keys.length) await redisClient.del(keys);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Failed to create task" });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 5, 50);
    const skip = (page - 1) * limit;

    const cacheKey = `tasks:${req.userId}:page:${page}:limit:${limit}`;
    console.log("CACHE key:", cacheKey);

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      console.log("✅ REDIS CACHE HIT:", cacheKey);
      return res.json(JSON.parse(cached));
    }

    const [tasks, total] = await Promise.all([
      Task.find({ user: req.userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments({ user: req.userId }),
    ]);

    const result = {
      tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 60 * 5,
    });

    console.log("STORED IN CACHE:", cacheKey);

    res.json(result);
  } catch (err) {
    console.error("err>>", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true },
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Invalidate cache
    const keys = await redisClient.keys(`tasks:${req.userId}:*`);
    if (keys.length) await redisClient.del(keys);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Invalidate cache
    const keys = await redisClient.keys(`tasks:${req.userId}:*`);
    if (keys.length) await redisClient.del(keys);

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
};
