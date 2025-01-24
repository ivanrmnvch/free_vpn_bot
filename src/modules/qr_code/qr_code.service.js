const { logInfo, logError } = require('../../utils/logger');
const { generateQRCode } = require('../qr_code/helpers');
const { InlineKeyboard } = require('grammy');
const { API } = require('../../utils/api');

const label = 'qrCode';

/** Метод получения QR кода */
const getQRCode = async (ctx) => {
	logInfo('Getting QR code', label, ctx);
	const { server, os } = ctx.session.steps;
	console.log('step', ctx.session.steps);

	if (!(server && os)) {
		// todo вывести сообщение, что закончилось время
		//  ожидания ответа, повторите процедуру получения VPN + кнопка: главное меню
		return;
	}

	const countryCode = server.slice(0, 2);
	const { id } = Object.values(ctx.update).pop().from;
	const qrCode = await generateQRCode(id, server);

	if (!qrCode) {
		await ctx.answerCallbackQuery({
			show_alert: true,
			text: ctx.getLangText('qrCode.errors.generate'),
		});
		return;
	}

	try {
		console.log('>>> test123');
		await API.post('xray-manager/client', { id });
		console.log('>>> test321');
	} catch (e) {
		// todo ошибка добавления пользователя
		await ctx.answerCallbackQuery({
			show_alert: true,
			text: ctx.getLangText('qrCode.errors.generate'),
		});
		return;
	}

	try {
		logInfo('Send qr code', label, ctx);
		await ctx.replyWithPhoto(qrCode, {
			caption: ctx.getLangText('qrCode.description', {
				server: ctx.getLangText(`common.countries.${countryCode}`),
			}),
			reply_markup: new InlineKeyboard()
				.url(
					ctx.getLangText('qrCode.downloadApp'),
					os === 'android'
						? process.env.ANDROID_APP_URL
						: process.env.IOS_APP_URL
				)
				.row()
				.text(ctx.getLangText('common.buttons.back'), 'back_to_os_menu')
				.row()
				.text(ctx.getLangText('common.buttons.mainMenu'), 'back_to_main_menu'),
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
