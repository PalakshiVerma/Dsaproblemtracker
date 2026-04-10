const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

// CREATE - POST /problems
router.post("/", async (req, res) => {
  try {
    const { title, platform, difficulty, topic, status, notes } = req.body;

    if (!title || !platform || !difficulty || !topic || !status) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    const newProblem = await Problem.create({
      title,
      platform,
      difficulty,
      topic,
      status,
      notes,
    });

    res.status(201).json(newProblem);
  } catch (error) {
    res.status(500).json({ error: "Failed to create problem." });
  }
});

// READ - GET /problems
router.get("/", async (req, res) => {
  try {
    const problems = await Problem.find().sort({ createdAt: -1 });
    res.json(problems);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch problems." });
  }
});

// UPDATE - PUT /problems/:id
router.put("/:id", async (req, res) => {
  try {
    const { title, platform, difficulty, topic, status, notes } = req.body;

    if (!title || !platform || !difficulty || !topic || !status) {
      return res.status(400).json({ error: "Please fill all required fields." });
    }

    const updatedProblem = await Problem.findByIdAndUpdate(
      req.params.id,
      { title, platform, difficulty, topic, status, notes },
      { new: true, runValidators: true }
    );

    if (!updatedProblem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    res.json(updatedProblem);
  } catch (error) {
    res.status(500).json({ error: "Failed to update problem." });
  }
});

// DELETE - DELETE /problems/:id
router.delete("/:id", async (req, res) => {
  try {
    const deletedProblem = await Problem.findByIdAndDelete(req.params.id);

    if (!deletedProblem) {
      return res.status(404).json({ error: "Problem not found." });
    }

    res.json({ message: "Problem deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete problem." });
  }
});

module.exports = router;