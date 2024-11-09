const serversService = require('./servers.service');
const serversRegExp = /servers:(\d+):(\d+)/;
const serverRegExp = /server:(.+)/;

module.exports = (bot) => {
	/** Метод получения списка серверов */
	bot.callbackQuery(serversRegExp, serversService.getServerListWrap);

	/** Метод получения QR кода для подключения к серверу */
	bot.callbackQuery(serverRegExp, serversService.getServer);
};
