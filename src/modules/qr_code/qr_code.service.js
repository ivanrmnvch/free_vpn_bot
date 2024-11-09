const { logInfo, logError } = require('../../utils/logger');
const { generateQRCode } = require('../qr_code/helpers');
const { InlineKeyboard } = require('grammy');

const label = 'qrCode';

/** Метод получения QR кода */
const getQRCode = async (ctx, code) => {
	logInfo('Getting QR code', label, ctx);

	const { id } = Object.values(ctx.update).pop().from;
	const qrCode = await generateQRCode(id, code);

	if (!qrCode) {
		await ctx.answerCallbackQuery({
			show_alert: true,
			text: ctx.getLangText('qrCode.errors.generate'),
		});
		return;
	}

	try {
		logInfo('Send qr code', label, ctx);
		await ctx.replyWithPhoto(qrCode, {
			caption: ctx.getLangText('qrCode.description'),
			reply_markup: new InlineKeyboard()
				.url(ctx.getLangText('qrCode.os.android'), process.env.ANDROID_APP_URL)
				.row()
				.url(ctx.getLangText('qrCode.os.ios'), process.env.IOS_APP_URL)
				.row()
				.text(ctx.getLangText('common.buttons.mainMenu'), 'back_to_main_menu')
				.text(
					ctx.getLangText('common.buttons.changeServer'),
					'back_to_server_menu'
				),
		});
	} catch (e) {
		logError('Sending qr code error', label, e);
		await ctx.answerCallbackQuery({
			show_alert: true,
			text: ctx.getLangText('qrCode.errors.sending'),
		});
	}
};

module.exports = { getQRCode };
