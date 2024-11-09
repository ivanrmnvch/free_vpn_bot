const { getLocaleText } = require('../../utils/getLocaleText');
const locale = require('../../locale');

const init = async (ctx, next) => {
	const [, value] = Object.entries(ctx.update).pop();

	const langCode = value?.from?.language_code;

	const lang = Object.keys(locale).includes(langCode) ? langCode : 'en';

	ctx.getLangText = (path, params) => getLocaleText(lang, path, params);

	next();
};

module.exports = init;
