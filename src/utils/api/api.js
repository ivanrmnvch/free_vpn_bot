const axios = require('axios');

class Api {
	constructor(baseURL) {
		this.instance = axios.create({
			baseURL,
			timeout: 60000,
			responseType: 'json',
		});
	}

	async get(url, config) {
		const { data } = await this.instance.get(url, config);
		return data;
	}

	async post(url, body = {}, config) {
		const { data } = await this.instance.post(url, body, config);
		return data;
	}
}

module.exports = Api;
