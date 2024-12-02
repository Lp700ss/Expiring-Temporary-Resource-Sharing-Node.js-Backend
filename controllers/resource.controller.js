const { Op } = require('sequelize');
const Resource = require('../models/resource.model');
const crypto = require('crypto');

exports.createResource = async (req, res) => {
  try {
    const { resource_url, expiration_time } = req.body;
    const accessToken = crypto.randomBytes(16).toString('hex');

    const resource = await Resource.create({
      resource_url,
      expiration_time,
      owner_id: req.user.id,
      access_token: accessToken,
    });

    res.status(201).json(resource);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getResources = async (req, res) => {
  try {
    const { status } = req.query;

    const whereClause = { owner_id: req.user.id };
    if (status === 'active') whereClause.is_active = true;
    if (status === 'expired') whereClause.is_active = false;

    const resources = await Resource.findAll({ where: whereClause });
    res.status(200).json(resources);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
