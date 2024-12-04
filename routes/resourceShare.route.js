
const express = require('express');
const router = express.Router();
const sharedResourceController = require('../controllers/sharedResource.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Share a resource (authenticated user)
router.post('/share', authMiddleware, sharedResourceController.shareResource);

module.exports = router;
