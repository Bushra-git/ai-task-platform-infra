const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks
} = require("../controllers/taskController");

router.post("/", authMiddleware, createTask);

router.get("/", authMiddleware, getTasks);

module.exports = router;