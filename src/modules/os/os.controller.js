const osService = require('./os.service');
const osRegExp = /os:(.+)/;

module.exports = (bot) => {
	/** Метод получения QR кода для подключения к серверу */
	bot.callbackQuery(osRegExp, osService.setOS);
};
