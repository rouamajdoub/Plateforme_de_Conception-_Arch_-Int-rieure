const mongoose = require("mongoose");
const Project = require("../models/Project");
const ArchitectClient = require("../models/Arch_Clients");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = "./uploads/projects";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, `project-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed!"));
  },
});

// Upload middleware
const uploadFields = upload.fields([
  { name: "coverImage", maxCount: 1 },
  { name: "beforePhotos", maxCount: 10 },
  { name: "afterPhotos", maxCount: 10 },
]);

// Create a new project
exports.createProject = async (req, res) => {
  try {
    // Handle the file uploads
    uploadFields(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      const {
        clientId,
        title,
        shortDescription,
        description,
        category,
        budget,
        startDate,
        endDate,
        tags,
        isPublic,
        showroomStatus,
        status,
      } = req.body;

      const architectId = req.user._id;

      // Verify that the client exists and belongs to this architect
      const client = await ArchitectClient.findOne({
        _id: clientId,
        architect: architectId,
      });

      if (!client) {
        return res.status(400).json({
          success: false,
          message: "Client not found or not associated with this architect.",
        });
      }

      // Process uploaded files
      let coverImagePath = null;
      const beforePhotosArray = [];
      const afterPhotosArray = [];

      if (req.files) {
        // Handle cover image
        if (req.files.coverImage && req.files.coverImage[0]) {
          coverImagePath = `/uploads/projects/${req.files.coverImage[0].filename}`;
        }

        // Handle before photos
        if (req.files.beforePhotos) {
          req.files.beforePhotos.forEach((file) => {
            beforePhotosArray.push(`/uploads/projects/${file.filename}`);
          });
        }

        // Handle after photos
        if (req.files.afterPhotos) {
          req.files.afterPhotos.forEach((file) => {
            afterPhotosArray.push(`/uploads/projects/${file.filename}`);
          });
        }
      }

      // If no cover image was uploaded and there's a URL in the request body, use that instead
      if (!coverImagePath && req.body.coverImage) {
        coverImagePath = req.body.coverImage;
      }

      // If still no cover image, provide a default placeholder
      if (!coverImagePath) {
        coverImagePath = "/uploads/projects/default-project-cover.jpg";

        // Create the default image if it doesn't exist
        const defaultImagePath = path.join(__dirname, "..", coverImagePath);
        const defaultImageDir = path.dirname(defaultImagePath);

        if (!fs.existsSync(defaultImageDir)) {
          fs.mkdirSync(defaultImageDir, { recursive: true });
        }

        if (!fs.existsSync(defaultImagePath)) {
          // Create a simple default image file (this is a placeholder solution)
          // In a real application, you'd want to have an actual default image file
          fs.copyFileSync(
            path.join(__dirname, "../assets/default-project-cover.jpg"),
            defaultImagePath
          );
        }
      }

      const project = new Project({
        clientId,
        architectId,
        title,
        shortDescription,
        description,
        category,
        budget: budget ? parseFloat(budget) : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        coverImage: coverImagePath,
        beforePhotos: beforePhotosArray,
        afterPhotos: afterPhotosArray,
        tags: tags ? JSON.parse(tags) : [],
        isPublic: isPublic === "true",
        showroomStatus: showroomStatus || "normal",
        status: status || "pending",
      });

      await project.save();

      // Add project to client's projects array
      await ArchitectClient.findByIdAndUpdate(clientId, {
        $push: { projects: project._id },
      });

      res.status(201).json({
        success: true,
        message: "Project created successfully!",
        project,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// The rest of your controller methods remain the same
exports.updateProject = async (req, res) => {
  try {
    // Handle the file uploads
    uploadFields(req, res, async function (err) {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message,
        });
      }

      const { projectId } = req.params;
      const updateData = { ...req.body };
      const architectId = req.user._id;

      // If clientId is being updated, verify the client exists and belongs to this architect
      if (updateData.clientId) {
        const client = await ArchitectClient.findOne({
          _id: updateData.clientId,
          architect: architectId,
        });

        if (!client) {
          return res.status(400).json({
            success: false,
            message: "Client not found or not associated with this architect.",
          });
        }
      }

      // Process uploaded files
      if (req.files) {
        // Handle cover image
        if (req.files.coverImage && req.files.coverImage[0]) {
          updateData.coverImage = `/uploads/projects/${req.files.coverImage[0].filename}`;
        }

        // Handle before photos
        if (req.files.beforePhotos && req.files.beforePhotos.length > 0) {
          const beforePaths = req.files.beforePhotos.map(
            (file) => `/uploads/projects/${file.filename}`
          );

          // If you want to append to existing photos, use this approach:
          const existingProject = await Project.findById(projectId);
          if (existingProject) {
            updateData.beforePhotos = [
              ...existingProject.beforePhotos,
              ...beforePaths,
            ];
          } else {
            updateData.beforePhotos = beforePaths;
          }
        }

        // Handle after photos
        if (req.files.afterPhotos && req.files.afterPhotos.length > 0) {
          const afterPaths = req.files.afterPhotos.map(
            (file) => `/uploads/projects/${file.filename}`
          );

          // If you want to append to existing photos, use this approach:
          const existingProject = await Project.findById(projectId);
          if (existingProject) {
            updateData.afterPhotos = [
              ...existingProject.afterPhotos,
              ...afterPaths,
            ];
          } else {
            updateData.afterPhotos = afterPaths;
          }
        }
      }

      // Parse boolean values
      if (updateData.isPublic) {
        updateData.isPublic = updateData.isPublic === "true";
      }

      // Parse tags if they're provided as a string
      if (updateData.tags && typeof updateData.tags === "string") {
        try {
          updateData.tags = JSON.parse(updateData.tags);
        } catch (e) {
          // If parsing fails, keep the original value
        }
      }

      // Ensure the architect can only update their own projects
      const project = await Project.findOneAndUpdate(
        { _id: projectId, architectId },
        updateData,
        { new: true }
      );

      if (!project) {
        return res.status(404).json({
          success: false,
          message:
            "Project not found or you do not have permission to update this project!",
        });
      }

      res.json({
        success: true,
        message: "Project updated successfully!",
        project,
      });
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete a project
exports.deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const architectId = req.user._id;

    // Find the project first to get the clientId
    const project = await Project.findOne({
      _id: projectId,
      architectId,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message:
          "Project not found or you do not have permission to delete this project!",
      });
    }

    // Delete associated files
    if (project.coverImage) {
      const coverImagePath = path.join(__dirname, "..", project.coverImage);
      if (fs.existsSync(coverImagePath)) {
        fs.unlinkSync(coverImagePath);
      }
    }

    // Delete before photos
    if (project.beforePhotos && project.beforePhotos.length > 0) {
      project.beforePhotos.forEach((photo) => {
        const photoPath = path.join(__dirname, "..", photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      });
    }

    // Delete after photos
    if (project.afterPhotos && project.afterPhotos.length > 0) {
      project.afterPhotos.forEach((photo) => {
        const photoPath = path.join(__dirname, "..", photo);
        if (fs.existsSync(photoPath)) {
          fs.unlinkSync(photoPath);
        }
      });
    }

    // Remove the project
    await Project.deleteOne({ _id: projectId });

    // Remove the project reference from the client
    await ArchitectClient.findByIdAndUpdate(project.clientId, {
      $pull: { projects: projectId },
    });

    res.json({
      success: true,
      message: "Project deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get single project details
exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const architectId = req.user._id;

    const project = await Project.findOne({
      _id: projectId,
      architectId,
    })
      .populate({
        path: "clientId",
        model: "ArchitectClient",
        select: "name email phone address",
      })
      .populate("architectId", "name email");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Get all projects for the logged-in architect
exports.getProjects = async (req, res) => {
  try {
    const architectId = req.user._id;

    const projects = await Project.find({ architectId })
      .populate({
        path: "clientId",
        model: "ArchitectClient",
        select: "name email phone",
      })
      .populate("architectId", "name email");

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Search Projects
exports.searchProjects = async (req, res) => {
  try {
    const { query, category, tags, minBudget, maxBudget } = req.query;
    const architectId = req.user._id;

    const filter = { architectId };

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

    const projects = await Project.find(filter)
      .populate({
        path: "clientId",
        model: "ArchitectClient",
        select: "name email phone",
      })
      .populate("architectId", "name email");

    res.json({
      success: true,
      count: projects.length,
      projects,
      searchParams: req.query,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
      return res.status(400).json({
        success: false,
        message: "Project ID and User ID are required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid Project ID or User ID",
      });
    }

    const project = await Project.findById(projectId);
    if (!project)
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });

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
      success: true,
      message: isLiked
        ? "Project unliked successfully!"
        : "Project liked successfully!",
      likesCount: project.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
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
      return res.status(404).json({
        success: false,
        message: "Project not found!",
      });

    res.json({
      success: true,
      projectId: project._id,
      likesCount: project.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve likes count",
      message: error.message,
    });
  }
};

// Get all projects for a specific client
exports.getProjectsByClient = async (req, res) => {
  try {
    const { clientId } = req.params;
    const architectId = req.user._id;

    // Verify that the client exists and belongs to this architect
    const client = await ArchitectClient.findOne({
      _id: clientId,
      architect: architectId,
    });

    if (!client) {
      return res.status(400).json({
        success: false,
        message: "Client not found or not associated with this architect.",
      });
    }

    const projects = await Project.find({
      clientId,
      architectId,
    })
      .populate({
        path: "clientId",
        model: "ArchitectClient",
        select: "name email phone",
      })
      .populate("architectId", "name email");

    res.json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
// Add milestone to a project
exports.addMilestone = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, status, dueDate } = req.body;
    const architectId = req.user._id;

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Milestone title is required",
      });
    }

    const milestone = {
      title,
      status: status || "pending",
      dueDate: dueDate || null,
    };

    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId },
      { $push: { milestones: milestone } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it",
      });
    }

    // Recalculate progress percentage based on milestones
    await updateProjectProgress(projectId);

    res.status(200).json({
      success: true,
      message: "Milestone added successfully",
      milestone: project.milestones[project.milestones.length - 1],
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete milestone from a project
exports.deleteMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const architectId = req.user._id;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId },
      { $pull: { milestones: { _id: milestoneId } } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it",
      });
    }

    // Recalculate progress percentage based on remaining milestones
    await updateProjectProgress(projectId);

    res.status(200).json({
      success: true,
      message: "Milestone deleted successfully",
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update milestone status
exports.updateMilestone = async (req, res) => {
  try {
    const { projectId, milestoneId } = req.params;
    const { title, status, dueDate } = req.body;
    const architectId = req.user._id;

    const updateFields = {};
    if (title) updateFields["milestones.$.title"] = title;
    if (status) updateFields["milestones.$.status"] = status;
    if (dueDate) updateFields["milestones.$.dueDate"] = dueDate;

    const project = await Project.findOneAndUpdate(
      {
        _id: projectId,
        architectId,
        "milestones._id": milestoneId,
      },
      { $set: updateFields },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project or milestone not found",
      });
    }

    // Recalculate progress percentage
    await updateProjectProgress(projectId);

    res.status(200).json({
      success: true,
      message: "Milestone updated successfully",
      project: {
        _id: project._id,
        milestones: project.milestones,
        progressPercentage: project.progressPercentage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update project progress percentage manually
exports.updateProjectProgress = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { progressPercentage } = req.body;
    const architectId = req.user._id;

    if (
      progressPercentage === undefined ||
      progressPercentage < 0 ||
      progressPercentage > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Progress percentage must be between 0 and 100",
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId },
      { progressPercentage },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project progress updated successfully",
      progressPercentage: project.progressPercentage,
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Add payment to project history
exports.addPayment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { amount, method, reference, notes } = req.body;
    const architectId = req.user._id;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid payment amount is required",
      });
    }

    const payment = {
      amount,
      date: new Date(),
      method: method || "unspecified",
      reference: reference || "",
      notes: notes || "",
    };

    const project = await Project.findOne({ _id: projectId, architectId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it",
      });
    }

    // Add payment to history
    project.paymentHistory.push(payment);

    // Calculate total paid amount
    const totalPaid = project.paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    // Update payment status
    if (project.budget) {
      if (totalPaid >= project.budget) {
        project.paymentStatus = "paid";
      } else if (totalPaid > 0) {
        project.paymentStatus = "partially_paid";
      } else {
        project.paymentStatus = "pending";
      }
    } else {
      // If no budget is set, but payment was made
      project.paymentStatus = totalPaid > 0 ? "partially_paid" : "pending";
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Payment added successfully",
      payment: project.paymentHistory[project.paymentHistory.length - 1],
      paymentStatus: project.paymentStatus,
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Update payment status manually
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { paymentStatus } = req.body;
    const architectId = req.user._id;

    if (
      !paymentStatus ||
      !["pending", "paid", "partially_paid"].includes(paymentStatus)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid payment status is required (pending, paid, or partially_paid)",
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId },
      { paymentStatus },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found or you don't have permission to update it",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      paymentStatus: project.paymentStatus,
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Delete payment from history
exports.deletePayment = async (req, res) => {
  try {
    const { projectId, paymentId } = req.params;
    const architectId = req.user._id;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, architectId },
      { $pull: { paymentHistory: { _id: paymentId } } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project or payment not found",
      });
    }

    // Recalculate payment status
    const totalPaid = project.paymentHistory.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );

    if (project.budget) {
      if (totalPaid >= project.budget) {
        project.paymentStatus = "paid";
      } else if (totalPaid > 0) {
        project.paymentStatus = "partially_paid";
      } else {
        project.paymentStatus = "pending";
      }
    } else {
      project.paymentStatus = totalPaid > 0 ? "partially_paid" : "pending";
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: "Payment deleted successfully",
      paymentStatus: project.paymentStatus,
      projectId: project._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// Helper function to update project progress based on milestones
async function updateProjectProgress(projectId) {
  try {
    const project = await Project.findById(projectId);
    if (!project) return;

    // If there are no milestones, set progress to 0
    if (!project.milestones || project.milestones.length === 0) {
      project.progressPercentage = 0;
    } else {
      // Calculate percentage based on completed milestones
      const totalMilestones = project.milestones.length;
      const completedMilestones = project.milestones.filter(
        (milestone) => milestone.status === "completed"
      ).length;

      project.progressPercentage = Math.round(
        (completedMilestones / totalMilestones) * 100
      );
    }

    await project.save();
    return project.progressPercentage;
  } catch (error) {
    console.error("Error updating project progress:", error);
    throw error;
  }
}
