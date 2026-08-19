require('dotenv').config();

const app = require('./app');
const { sequelize } = require('./models');

const port = Number(process.env.PORT || 5000);

async function start() {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Backend API listening on ${port}`);
  });
}

start().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});
