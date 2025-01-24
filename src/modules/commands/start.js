const { InlineKeyboard, GrammyError } = require('grammy');
const { logInfo, logError } = require('../../utils/logger');
const { API } = require('../../utils/api');

const label = 'Start';

const start = async (ctx) => {
	logInfo('Get started', label, ctx);
	const buttons = new InlineKeyboard()
		.text(ctx.getLangText('start.getVpnKey'), 'servers:5:0')
		.row();

	if (ctx.update.callback_query?.message?.photo) {
		try {
			logInfo('Return to main menu from QR code', label, ctx);
			await ctx.deleteMessage();
			await ctx.reply(ctx.getLangText('start.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			logError('Error returning to main menu from QR code', label, e);
		}
		return;
	}

	if (ctx.update.callback_query?.message?.text) {
		try {
			logInfo('Return to main menu from message');
			await ctx.answerCallbackQuery();
			await ctx.editMessageText(ctx.getLangText('start.title'), {
				reply_markup: buttons,
			});
		} catch (e) {
			logError('Error returning to main menu from message', label, e);
		}
		return;
	}

	try {
		logInfo('Update user info', label, ctx);
		const {
			id,
			first_name: firstName,
			username: userName,
			language_code: lang,
		} = Object.values(ctx.update).pop().from;

		await API.post('user', {
			id,
			firstName,
			userName,
			lang,
		});
	} catch (e) {
		logError('Error update user', label, e);
		// todo test должно выкинуть в global
		// throw new GrammyError.Error();
	}

	await ctx.reply(ctx.getLangText('start.title'), {
		reply_markup: buttons,
	});
};

module.exports = start;
