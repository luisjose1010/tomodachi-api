const { app } = require('../dist/index.js');
const { disconnectPrismaClient } = require('../dist/services/db.js');

module.exports = async (req, res) => {
  try {
    await app(req, res);
  } finally {
    await disconnectPrismaClient();
  }
};
