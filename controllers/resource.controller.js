const { v4: uuidv4 } = require('uuid');
const Resource = require('../models/resource.model');

// Create a resource
exports.createResource = async (req, res) => {
  try {
    const { resource_url, expiration_time } = req.body;

    // Validate expiration time
    if (new Date(expiration_time) <= new Date()) {
      return res.status(400).json({ error: 'Expiration time must be in the future.' });
    }

    // Generate a secure access token
    const access_token = uuidv4();

    // Save resource in the database
    const resource = await Resource.create({
      user_id: req.user.id, // Assuming `req.user` is populated by auth middleware
      resource_url,
      access_token,
      expiration_time,
    });

    res.status(201).json({ resource });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Fetch all resources for the logged-in user with optional filters
exports.getResources = async (req, res) => {
  try {
    const userId = req.user.id; 
    const { status } = req.query;

    const whereClause = { user_id: userId };
    if (status) {
      whereClause.status = status;
    }

    const resources = await Resource.findAll({
      where: whereClause,
      attributes: ['id', 'resource_url', 'status', 'expiration_time', 'created_at'],
    });

    res.status(200).json({ resources });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Access a specific resource if it's active
exports.getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findOne({
      where: { id, status: 'active' },
    });

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found or not active' });
    }

    res.status(200).json({ resource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Delete a resource (only by the owner)
exports.deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const resource = await Resource.findOne({ where: { id, user_id: userId } });

    if (!resource) {
      return res.status(403).json({ error: 'You are not authorized to delete this resource' });
    }

    await Resource.destroy({ where: { id } });
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Upload and register a resource
exports.uploadResource = async (req, res) => {
  try {
    const { expiration_time } = req.body;

    // Validate expiration time
    if (new Date(expiration_time) <= new Date()) {
      return res.status(400).json({ error: 'Expiration time must be in the future.' });
    }

    // Construct resource URL (using file path from Multer)
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const resource_url = `/uploads/${req.file.filename}`;

    // Generate a secure access token
    const access_token = uuidv4();

    // Save the resource in the database
    const resource = await Resource.create({
      user_id: req.user.id, // Assuming `req.user` is populated by auth middleware
      resource_url,
      access_token,
      expiration_time,
    });

    res.status(201).json({
      message: 'Resource uploaded successfully.',
      resource,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all resources with optional filters
// exports.getResources = async (req, res) => {
//   try {
//     const { user_id, expired } = req.query;

//     // Build the query object
//     const query = {};
//     if (user_id) query.user_id = user_id; // Filter by user ID
//     if (expired === 'true') {
//       query.expiration_time = { $lte: new Date() }; // Only expired resources
//     } else if (expired === 'false') {
//       query.expiration_time = { $gt: new Date() }; // Only active resources
//     }

//     // Fetch resources from the database
//     const resources = await Resource.find(query);

//     res.status(200).json({
//       count: resources.length,
//       resources,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
