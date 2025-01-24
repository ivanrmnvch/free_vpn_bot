const serversService = require('../servers/servers.service');
const osService = require('../os/os.service');

const servers = async (ctx) => {
	await serversService.getServerList(ctx);
};

const osList = async (ctx) => {
	await osService.getOSList(ctx);
};

module.exports = {
	servers,
	osList,
};
