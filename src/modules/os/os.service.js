const { InlineKeyboard } = require('grammy');
const { getQRCode } = require('../qr_code/qr_code.service');
const { logInfo, logError } = require('../../utils/logger');

const getOSList = async (ctx) => {
	const buttons = new InlineKeyboard()
		.text(ctx.getLangText('os.android'), 'os:android')
		.text(ctx.getLangText('os.ios'), 'os:ios')
		.row()
		.text(ctx.getLangText('os.windows'), 'os:windows')
		.text(ctx.getLangText('os.macos'), 'os:macos')
		.row()
		.text(ctx.getLangText('os.linux'), 'os:linux')
		.text(ctx.getLangText('common.buttons.changeServer'), 'back_to_server_menu')
		.row()
		.text(ctx.getLangText('common.buttons.mainMenu'), 'back_to_main_menu');

	if (ctx.update.callback_query?.message?.photo) {
		try {
			// logInfo('Return to servers from QR code', label, ctx);
			await ctx.deleteMessage();
			await ctx.reply(ctx.getLangText('os.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			// logError('Error returning to servers from QR code', label, e);
		}
		return;
	}

	if (ctx.update.callback_query?.message?.text) {
		try {
			// logInfo('Return to servers from message', label, ctx);
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(ctx.getLangText('os.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			// logError('Error returning to servers from message', label, e);
		}
		return;
	}

	await ctx.reply(ctx.getLangText('os.title'), {
		reply_markup: buttons,
	});
};

const setOS = async (ctx) => {
	const { data } = ctx.update.callback_query;
	const os = data.split(':').pop();

	// ctx.session.steps.os = os;

	if (['android', 'ios'].includes(os)) {
		await getQRCode(ctx);
		return;
	}
	// await getConnectConfig(ctx);
};

module.exports = {
	getOSList,
	setOS,
};
