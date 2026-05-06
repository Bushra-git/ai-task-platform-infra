const Task = require("../models/task");
const queue = require("../config/queue");

exports.createTask = async (req, res) => {

  try {

    const { title, inputText, operation } = req.body;

    const task = await Task.create({

      user: req.user.id,

      title,
      inputText,
      operation,

      status: "pending"

    });

    await queue.add("processTask", {
  taskId: task._id.toString()
});

    res.status(201).json(task);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};


exports.getTasks = async (req, res) => {

  try {

    const tasks = await Task.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json(tasks);

  } catch (error) {

    res.status(500).json({
      error: error.message
    });

  }

};