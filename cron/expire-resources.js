const cron = require('node-cron');
const { Op } = require('sequelize'); 
const Resource = require('../models/resource.model'); 

// Schedule the cron job to run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    // Mark resources as inactive if they are expired
    const updatedCount = await Resource.update(
      { is_active: false }, 
      {
        where: {
          expiration_time: { [Op.lt]: new Date() }, // Compare expiration_time with the current time
          is_active: true, // Only update resources that are still active
        },
      }
    );

    console.log(`Expired resources updated: ${updatedCount[0]} resources marked as inactive.`);
  } catch (error) {
    console.error('Error updating expired resources:', error);
  }
});
