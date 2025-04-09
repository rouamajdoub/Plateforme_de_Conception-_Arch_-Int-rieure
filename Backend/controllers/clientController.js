const ArchitectClient = require("../models/Arch_Clients");

// Create a new client
exports.createClient = async (req, res) => {
  try {
    const client = new ArchitectClient({
      ...req.body,
      architect: req.user._id, // Associate client with the architect
    });
    await client.save();
    res.status(201).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Get all clients for the architect
exports.getClients = async (req, res) => {
  try {
    const clients = await ArchitectClient.find({ architect: req.user._id });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Update a client
exports.updateClient = async (req, res) => {
  try {
    const client = await ArchitectClient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const client = await ArchitectClient.findByIdAndDelete(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Search clients by name
exports.searchClients = async (req, res) => {
  try {
    const { query } = req.params;
    const clients = await ArchitectClient.find({
      architect: req.user._id,
      name: { $regex: query, $options: "i" },
    });
    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
// Get a client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await ArchitectClient.findById(req.params.id);
    if (!client) {
      return res
        .status(404)
        .json({ success: false, error: "Client not found" });
    }
    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
