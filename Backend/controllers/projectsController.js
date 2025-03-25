const mongoose = require("mongoose");

const Project = require("../models/Project");

// **Create a new project**
exports.createProject = async (req, res) => {
  try {
    const {
      clientId,
      title,
      shortDescription,
      description,
      category,
      budget,
      startDate,
      endDate,
      coverImage,
    } = req.body;

    const project = new Project({
      clientId,
      title,
      shortDescription,
      description,
      category,
      budget,
      startDate,
      endDate,
      coverImage,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Update project details**
exports.updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const updateData = req.body;

    const project = await Project.findByIdAndUpdate(projectId, updateData, {
      new: true,
    });

    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json({ message: "Project updated successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Delete a project**
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findByIdAndDelete(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Get single project details**
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("clientId", "name email")
      .populate("architectId", "name email");

    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Get all projects**
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Search Projects**
exports.searchProjects = async (req, res) => {
  try {
    const { query, category, tags, location, minBudget, maxBudget } = req.query;

    // Build a complex filter object
    const filter = {};

    // Text-based search across multiple fields
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { shortDescription: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    // Category-specific filter
    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    // Tags filter
    if (tags) {
      // Split tags and create a regex search
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray.map((tag) => new RegExp(tag, "i")) };
    }

    // Budget range filter
    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseFloat(minBudget);
      if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
    }
    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }
    // Perform the search
    const projects = await Project.find(filter)
      .populate("clientId", "name email")
      .populate("architectId", "name email");

    res.json({
      count: projects.length,
      projects,
      searchParams: req.query, // Return the search parameters for transparency
    });
  } catch (error) {
    console.error("Search Projects Error:", error);
    res.status(500).json({
      error: "Search failed",
      message: error.message,
    });
  }
};
//like and unlike project
exports.likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    // Validate input
    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });
    }

    // Validate ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid Project ID or User ID" });
    }

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    // Ensure likes array exists
    project.likes = project.likes || [];

    // Convert userId to string for comparison
    const userIdString = userId.toString();

    // Check if user has already liked the project
    const isLiked = project.likes.some(
      (likedUserId) => likedUserId.toString() === userIdString
    );

    if (isLiked) {
      // Unlike: Remove user's like
      project.likes = project.likes.filter(
        (likedUserId) => likedUserId.toString() !== userIdString
      );
    } else {
      // Like: Add user's like
      project.likes.push(userId);
    }

    // Save the updated project
    await project.save();

    res.json({
      message: isLiked
        ? "Project unliked successfully!"
        : "Project liked successfully!",
      project: {
        ...project.toObject(),
        likesCount: project.likes.length,
      },
    });
  } catch (error) {
    console.error("Like/Unlike Project Error:", error);
    res.status(500).json({
      error: "Failed to like/unlike project",
      message: error.message,
    });
  }
};

// Add a route to get project likes count
exports.getProjectLikesCount = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    res.json({
      projectId: project._id,
      likesCount: project.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to retrieve likes count",
      message: error.message,
    });
  }
};
