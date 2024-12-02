const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/db');
const userRoutes = require('./routes/user.routes');
const resourceRoutes = require('./routes/resource.routes');
require('./cron/expire-resources');

const app = express();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3000;

app.use('/api/users', userRoutes);
app.use('/api/resources', resourceRoutes);

sequelize.sync({ force: false }).then(() => {
  console.log('Database synced.');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

sequelize.sync({ force: false })
  .then(() => {
    console.log('Database connected and synced.');
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  });
