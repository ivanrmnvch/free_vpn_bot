const locale = require('../locale');

/**
 * Добавление переменных к строке
 * Параметры описываются в виде #{<ключ параметра>}
 *
 * @param {string} string
 * @param {Object} params
 * @return {string}
 */
const paramParser = (string, params) => {
	let newString = string;
	Object.keys(params).forEach((param) => {
		newString = newString.replace(`#{${param}}`, params[param].toString());
	});
	return newString;
};

const getLocaleText = (lang, path, params = null) => {
	const langString = path
		.split('.')
		.reduce((acc, field) => (acc[field] ? acc[field] : acc), locale[lang]);
	return params ? paramParser(langString, params) : langString;
};

module.exports = {
	getLocaleText,
};
