const Client = require("../models/Client");

// ✅ Get all clients
exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Create a new client
exports.createClient = async (req, res) => {
  try {
    const { pseudo, nomDeFamille, prenom, email, password, phoneNumber, location } = req.body;

    const existingClient = await Client.findOne({ email });
    if (existingClient) {
      return res.status(400).json({ message: "Client already exists" });
    }

    const newClient = new Client({ pseudo, nomDeFamille, prenom, email, password, phoneNumber, location });
    await newClient.save();

    res.status(201).json({ message: "Client created successfully", newClient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Get a client by ID
exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: "Client not found" });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update a client
exports.updateClient = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedClient) return res.status(404).json({ message: "Client not found" });

    res.json({ message: "Client updated successfully", updatedClient });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Delete a client
exports.deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    if (!deletedClient) return res.status(404).json({ message: "Client not found" });

    res.json({ message: "Client deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
