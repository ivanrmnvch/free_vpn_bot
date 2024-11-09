const { logInfo, logError } = require('../../utils/logger');
const { API } = require('../../utils/api');
const { InlineKeyboard } = require('grammy');
const qrCodeService = require('../qr_code/qr_code.service');
const notify = require('./helpers/notify');

const label = 'Servers';

const getServerList = async (ctx, limit = 5, offset = 0) => {
	let servers;

	try {
		logInfo('Getting servers', label, ctx);
		servers = await API.get('servers', { params: { limit, offset } });
	} catch (e) {
		logError('Getting servers error', label, e);
		await notify(ctx, ctx.getLangText('servers.error.serverList'));
		return;
	}

	const buttons = servers.data.reduce(
		(instance, server) =>
			instance
				.text(
					ctx.getLangText(`common.countries.${server.country_code}`),
					`server:${server.name}`
				)
				.row(),
		new InlineKeyboard()
	);

	if (offset > 0) {
		buttons.text(
			ctx.getLangText('common.buttons.back'),
			`servers:${limit}:${Math.max(0, offset - limit)}`
		);
	}

	if (offset + limit < servers.total) {
		buttons.text(
			ctx.getLangText('common.buttons.next'),
			`servers:${limit}:${offset + limit}`
		);
	}

	buttons
		.row()
		.text(ctx.getLangText('common.buttons.mainMenu'), 'back_to_main_menu');

	if (ctx.update.callback_query?.message?.photo) {
		try {
			logInfo('Return to servers from QR code', label, ctx);
			await ctx.deleteMessage();
			await ctx.reply(ctx.getLangText('servers.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			logError('Error returning to servers from QR code', label, e);
		}
		return;
	}

	if (ctx.update.callback_query?.message?.text) {
		try {
			logInfo('Return to servers from message', label, ctx);
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(ctx.getLangText('servers.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			logError('Error returning to servers from message', label, e);
		}
		return;
	}

	await ctx.reply(ctx.getLangText('servers.title'), {
		reply_markup: buttons,
	});
};

const getServer = async (ctx) => {
	const { data } = ctx.update.callback_query;
	const name = data.split(':').pop();

	try {
		await ctx.deleteMessage();
		await ctx.answerCallbackQuery();
	} catch (e) {
		logError('Message editing error', label, e);
		return;
	}

	await qrCodeService.getQRCode(ctx, name);
};

const getServerListWrap = async (ctx) => {
	const { data } = ctx.update.callback_query;
	const [, limit, offset] = data.split(':').map(Number);
	return getServerList(ctx, limit, offset);
};

module.exports = {
	getServerList,
	getServer,
	getServerListWrap,
};
