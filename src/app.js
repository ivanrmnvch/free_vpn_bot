const { Bot, session } = require('grammy');

const { logError } = require('./utils/logger');

const start = require('./modules/commands/start');
const init = require('./modules/middlewares/init');

const serversController = require('./modules/servers/servers.controller');
const routerController = require('./modules/router/router.controller');
const osController = require('./modules/os/os.controller');

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Bot(token);

// todo
// start -> получить ключ -> выберите сервер -> qr-code + android, ios

bot.use(
	session({
		initial: () => ({ steps: { server: null, os: null } }),
	})
);

bot.use(init);
bot.command('start', start);

serversController(bot);
routerController(bot);
osController(bot);

bot.catch((err) => {
	logError('Global error', 'App', err);
	err.ctx.reply(err.ctx.getLangText('common.errors.global'));
});

bot.start();
