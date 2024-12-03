const express = require('express');
const { createResource, getResources, uploadResource } = require('../controllers/resource.controller');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware'); // Import Multer configuration

const router = express.Router();

// Authenticated Routes
router.post('/', auth, createResource); // Create a new resource
// router.get('/resources', auth, getResources); // Get all resources with filters

// Additional Authenticated Routes
router.post('/create', authMiddleware, createResource); // Alternative route for creating a resource
// router.get('/list', authMiddleware, getResources); // Alternative route for fetching resources

// File Upload Route
router.post('/upload', authMiddleware, upload.single('file'), uploadResource); // Add Multer middleware here

module.exports = router;
