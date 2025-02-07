const Admin = require("../models/Admin");

// ✅ Get all admins
exports.getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new admin
exports.createAdmin = async (req, res) => {
  try {
    const { pseudo, email, password, role } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const newAdmin = new Admin({ pseudo, email, password, role });
    await newAdmin.save();

    res.status(201).json({ message: "Admin created successfully", newAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get an admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update an admin
exports.updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin updated successfully", updatedAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete an admin
exports.deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin)
      return res.status(404).json({ message: "Admin not found" });

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
