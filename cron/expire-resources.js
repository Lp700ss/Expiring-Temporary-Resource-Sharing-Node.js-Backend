const cron = require('node-cron');
const Resource = require('../models/resource.model');

cron.schedule('*/5 * * * *', async () => {
  await Resource.update({ is_active: false }, {
    where: {
      expiration_time: { [Op.lt]: new Date() },
      is_active: true,
    },
  });
  console.log('Expired resources updated.');
});
