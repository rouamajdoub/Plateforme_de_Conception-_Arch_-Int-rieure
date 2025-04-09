const mongoose = require("mongoose");
const Project = require("../models/Project");

// **Create a new project**
exports.createProject = async (req, res) => {
  try {
    const {
      clientId,
      clientType, // "visionaClient" or "architectClient"
      title,
      shortDescription,
      description,
      category,
      budget,
      startDate,
      endDate,
      coverImage,
      tags,
      isPublic,
      showroomStatus,
      images,
      videos,
    } = req.body;

    const architectId = req.user._id;

    // 🔎 Verify that the client exists in the correct collection
    let isValidClient = false;

    if (clientType === "visionaClient") {
      isValidClient = await mongoose.model("User").findById(clientId);
    } else if (clientType === "architectClient") {
      isValidClient = await mongoose
        .model("ArchitectClient")
        .findById(clientId);
    }

    if (!isValidClient) {
      return res
        .status(400)
        .json({ message: "Invalid client ID or client type." });
    }

    const project = new Project({
      clientId,
      clientType,
      architectId,
      title,
      shortDescription,
      description,
      category,
      budget,
      startDate,
      endDate,
      coverImage,
      tags: tags || [],
      isPublic: isPublic !== undefined ? isPublic : false,
      showroomStatus: showroomStatus || "normal",
      images: images || [],
      videos: videos || [],
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

    // Check if client type is being updated and verify the client exists
    if (updateData.clientId && updateData.clientType) {
      let isValidClient = false;

      if (updateData.clientType === "visionaClient") {
        isValidClient = await mongoose
          .model("User")
          .findById(updateData.clientId);
      } else if (updateData.clientType === "architectClient") {
        isValidClient = await mongoose
          .model("ArchitectClient")
          .findById(updateData.clientId);
      }

      if (!isValidClient) {
        return res
          .status(400)
          .json({ message: "Invalid client ID or client type." });
      }
    }

    // Ensure the architect can only update their own projects
    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId: req.user._id },
      updateData,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or you do not have permission to update this project!",
      });
    }

    res.json({ message: "Project updated successfully!", project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Delete a project**
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Ensure the architect can only delete their own projects
    const project = await Project.findOneAndDelete({
      _id: projectId,
      architectId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        message:
          "Project not found or you do not have permission to delete this project!",
      });
    }

    res.json({ message: "Project deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Get single project details**
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found!" });
    }

    // Populate client data based on clientType
    if (project.clientType === "visionaClient") {
      await project.populate("clientId", "name email");
    } else if (project.clientType === "architectClient") {
      await project.populate({
        path: "clientId",
        model: "ArchitectClient",
        select: "name email phone",
      });
    }

    // Populate architect data
    await project.populate("architectId", "name email");

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Get all projects**
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    // Process each project to populate the correct client type
    const populatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (project.clientType === "visionaClient") {
          await project.populate("clientId", "name email");
        } else if (project.clientType === "architectClient") {
          await project.populate({
            path: "clientId",
            model: "ArchitectClient",
            select: "name email phone",
          });
        }

        await project.populate("architectId", "name email");
        return project;
      })
    );

    res.json(populatedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Search Projects**
exports.searchProjects = async (req, res) => {
  try {
    const { query, category, tags, location, minBudget, maxBudget } = req.query;

    const filter = {};

    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: "i" } },
        { shortDescription: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { tags: { $in: [new RegExp(query, "i")] } },
      ];
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim());
      filter.tags = { $in: tagArray.map((tag) => new RegExp(tag, "i")) };
    }

    if (minBudget || maxBudget) {
      filter.budget = {};
      if (minBudget) filter.budget.$gte = parseFloat(minBudget);
      if (maxBudget) filter.budget.$lte = parseFloat(maxBudget);
    }

    const projects = await Project.find(filter);

    // Process each project to populate the correct client type
    const populatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (project.clientType === "visionaClient") {
          await project.populate("clientId", "name email");
        } else if (project.clientType === "architectClient") {
          await project.populate({
            path: "clientId",
            model: "ArchitectClient",
            select: "name email phone",
          });
        }

        await project.populate("architectId", "name email");
        return project;
      })
    );

    res.json({
      count: populatedProjects.length,
      projects: populatedProjects,
      searchParams: req.query,
    });
  } catch (error) {
    console.error("Search Projects Error:", error);
    res.status(500).json({
      error: "Search failed",
      message: error.message,
    });
  }
};

// Like and unlike project
exports.likeProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.body;

    if (!projectId || !userId) {
      return res
        .status(400)
        .json({ message: "Project ID and User ID are required" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ message: "Invalid Project ID or User ID" });
    }

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({ message: "Project not found!" });

    project.likes = project.likes || [];

    const userIdString = userId.toString();
    const isLiked = project.likes.some(
      (likedUserId) => likedUserId.toString() === userIdString
    );

    if (isLiked) {
      project.likes = project.likes.filter(
        (likedUserId) => likedUserId.toString() !== userIdString
      );
    } else {
      project.likes.push(userId);
    }

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

// Get project likes count
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

// **Get all projects for a specific architect**
exports.getProjectsByArchitect = async (req, res) => {
  try {
    const architectId = req.user._id; // Get the logged-in architect's ID

    const projects = await Project.find({ architectId });

    // Process each project to populate the correct client type
    const populatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (project.clientType === "visionaClient") {
          await project.populate("clientId", "name email");
        } else if (project.clientType === "architectClient") {
          await project.populate({
            path: "clientId",
            model: "ArchitectClient",
            select: "name email phone",
          });
        }

        await project.populate("architectId", "name email");
        return project;
      })
    );

    res.json(populatedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **Get all projects for a specific client**
exports.getProjectsByClient = async (req, res) => {
  try {
    const { clientId, clientType } = req.params;

    if (!clientId || !clientType) {
      return res.status(400).json({
        message: "Client ID and client type are required",
      });
    }

    const projects = await Project.find({
      clientId,
      clientType,
    });

    // Process each project to populate the correct client type
    const populatedProjects = await Promise.all(
      projects.map(async (project) => {
        if (project.clientType === "visionaClient") {
          await project.populate("clientId", "name email");
        } else if (project.clientType === "architectClient") {
          await project.populate({
            path: "clientId",
            model: "ArchitectClient",
            select: "name email phone",
          });
        }

        await project.populate("architectId", "name email");
        return project;
      })
    );

    res.json(populatedProjects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
