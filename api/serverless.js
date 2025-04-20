const { app } = require('../dist/index.js');

module.exports = async (req, res) => {
  app(req, res);
};
