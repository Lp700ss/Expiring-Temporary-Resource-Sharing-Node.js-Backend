const express = require('express');
const { 
  createResource, 
  getResources, 
  uploadResource ,
  getResourceById,
  deleteResource
} = require('../controllers/resource.controller');

const {
  shareResource,
  getSharedResources,
  checkResourceStatus
} = require('../controllers/sharedResource.controller');

const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/auth.middleware');
const upload = require('../middleware/multer.middleware'); // Import Multer configuration

const router = express.Router();

// Authenticated Routes for Resources
router.post('/', auth, createResource); // Create a new resource
router.post('/create', authMiddleware, createResource); // Alternative route for creating a resource
router.post('/upload', authMiddleware, upload.single('file'), uploadResource); // File upload route

// Shared Resource Routes
router.post('/share', authMiddleware, shareResource); // Share a resource
router.get('/shared', authMiddleware, getSharedResources); // Get shared resources
router.get('/status/:resource_id', authMiddleware, checkResourceStatus); // Check resource status


// Fetch all resources
router.get('/resources', authMiddleware, getResources);

// Access a specific resource
router.get('/resources/:id', authMiddleware, getResourceById);

// Delete a resource
router.delete('/resources/:id', authMiddleware, deleteResource);

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const accessToken = req.query.access_token;
  
    try {
      const resource = await db('resources').where({ id }).first();
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found.' });
      }
  
      // Validate the access token
      if (resource.access_token !== accessToken) {
        return res.status(403).json({ error: 'Invalid or missing access token.' });
      }
  
      // Check expiration
      if (new Date() > new Date(resource.expiration_time)) {
        return res.status(410).json({ error: 'Resource has expired.' });
      }
  
      res.status(200).json({ resource });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred.' });
    }
  });

//SHare resource to USer ID
  router.post('/:id/share', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { recipient_user_id } = req.body;
  
    try {
      const resource = await db('resources').where({ id, user_id: req.user.id }).first();
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found or unauthorized.' });
      }
  
      const newAccessToken = uuidv4();
      await db('resources').insert({
        user_id: recipient_user_id,
        resource_url: resource.resource_url,
        access_token: newAccessToken,
        expiration_time: resource.expiration_time,
        status: 'active',
      });
  
      res.status(200).json({ message: 'Resource shared successfully.', access_token: newAccessToken });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while sharing the resource.' });
    }
  });
  

  router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
  
    try {
      const resource = await db('resources').where({ id, user_id: req.user.id }).first();
  
      if (!resource) {
        return res.status(404).json({ error: 'Resource not found or unauthorized.' });
      }
  
      await db('resources').where({ id }).del();
      res.status(200).json({ message: 'Resource deleted successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while deleting the resource.' });
    }
  });

  router.get('/', authMiddleware, async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
  
    try {
      const query = db('resources').where({ user_id: req.user.id });
  
      if (status) {
        query.andWhere({ status });
      }
  
      const resources = await query.limit(limit).offset(offset);
      const total = await query.clone().count('id as count').first();
  
      res.status(200).json({
        resources,
        total: total.count,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while fetching resources.' });
    }
  });
  
  

module.exports = router;
