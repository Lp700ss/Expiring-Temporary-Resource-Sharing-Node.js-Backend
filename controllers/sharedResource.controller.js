const db = require('../models/resourceShare.model'); // Assuming Sequelize or similar ORM is used

// Share a Resource
exports.shareResource = async (req, res) => {
  const { resource_id, shared_with_user_id, expiration_time } = req.body;
  const user_id = req.user.id; // Authenticated user ID

  try {
    // Check if resource exists and belongs to the user
    const resource = await db.Resource.findOne({ where: { id: resource_id, user_id } });
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found or unauthorized' });
    }

    // Check if the user to share with exists
    const sharedWithUser = await db.User.findOne({ where: { id: shared_with_user_id } });
    if (!sharedWithUser) {
      return res.status(404).json({ message: 'User to share with not found' });
    }

    // Create a shared resource entry
    const sharedResource = await db.SharedResource.create({
      resource_id,
      shared_with_user_id,
      expiration_time,
    });

    res.status(200).json({
      message: 'Resource shared successfully.',
      sharedResource,
    });
  } catch (error) {
    console.error('Error sharing resource:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Get Shared Resources
exports.getSharedResources = async (req, res) => {
  const user_id = req.user.id; // Authenticated user ID

  try {
    const sharedResources = await db.SharedResource.findAll({
      where: { shared_with_user_id: user_id },
      include: [
        {
          model: db.Resource,
          as: 'resource', // Ensure association is correct
          attributes: ['id', 'resource_url', 'expiration_time'],
        },
        {
          model: db.User,
          as: 'sharedBy', // Ensure association is correct
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    if (sharedResources.length === 0) {
      return res.status(404).json({ message: 'No shared resources found.' });
    }

    res.status(200).json(sharedResources);
  } catch (error) {
    console.error('Error fetching shared resources:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// Check Resource Status
exports.checkResourceStatus = async (req, res) => {
  const { resource_id } = req.params;

  try {
    const resource = await db.Resource.findOne({ where: { id: resource_id } });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    // Compare the expiration time
    const isExpired = new Date() > new Date(resource.expiration_time);

    res.status(200).json({
      resource_id,
      status: isExpired ? 'expired' : 'active',
    });
  } catch (error) {
    console.error('Error checking resource status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
