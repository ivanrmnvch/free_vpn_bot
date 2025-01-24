const start = require('../commands/start');
const routerService = require('./router.service');

module.exports = (bot) => {
	/** Метод возврата к главному меню */
	bot.callbackQuery('back_to_main_menu', start);

	/** Метод возврата к меню выбора сервера */
	bot.callbackQuery('back_to_server_menu', routerService.servers);

	/** Метод возврата к меню выбора ос */
	bot.callbackQuery('back_to_os_menu', routerService.osList);
};
