const Project = require("../models/Project");

exports.createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("clientId architectId needsSheet quotes reviews matches");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id).populate("clientId architectId needsSheet quotes reviews matches");
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new Project Review (this can be moved to reviewController)
exports.createProjectReview = async (req, res) => {
  try {
    const { client, comment, rating } = req.body; // Make sure to include projectId
    const projectId = req.params.id;

    const review = new ProjectReview({
      client,
      comment,
      rating,
      projectId,
    });

    await review.save();
    res.status(201).json({ message: "Project review created successfully!", review });
  } catch (error) {
    console.error("Error creating project review:", error);
    res.status(400).json({ error: error.message });
  }
};