const start = require('../commands/start');
const routerService = require('./router.service');

module.exports = (bot) => {
	/** Метод возврата к главному меню */
	bot.callbackQuery('back_to_main_menu', start);

	bot.callbackQuery('back_to_server_menu', routerService.servers);
};
