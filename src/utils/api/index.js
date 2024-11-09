const { BACKEND_BASE_URL } = require('../../config/envConfig').app;
const Api = require('./api');

const API = new Api(BACKEND_BASE_URL);

module.exports = { API };
