const Api = require('./api');

const API = new Api(process.env.BACKEND_BASE_URL);

module.exports = { API };
