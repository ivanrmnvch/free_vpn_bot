// const { API } = require('../../../utils/api');
// const { logInfo, logError } = require('../../../utils/logger');
//
// const label = 'Middlewares/Meta';
//
// const checkUser = (id) => {
// 	try {
// 		logInfo('Check user exist', label, { id });
// 		return API.post(`user/${id}/check`);
// 	} catch (e) {
// 		logError('User checking error', label, e);
// 	}
// };
//
// const addUser = (body) => {
// 	try {
// 		logInfo('Adding a new user', label, { body });
// 		return API.post('user', body);
// 	} catch (e) {
// 		logError('Error adding new user', label, e);
// 	}
// };
//
// const getUserMeta = (id) => {
// 	try {
// 		logInfo('Getting user meta', label, { id });
// 		return API.get(`user/${id}/meta`);
// 	} catch (e) {
// 		logError('Error getting user meta', label, e);
// 	}
// };
//
// const getMeta = async (ctx) => {
// 	const {
// 		id,
// 		first_name: firstName,
// 		username: userName,
// 		language_code: lang,
// 	} = Object.values(ctx.update).pop().from;
//
// 	const check = await checkUser(id);
//
// 	if (!check) {
// 		await addUser({
// 			id,
// 			firstName,
// 			userName,
// 			lang,
// 		});
// 	}
//
// 	return getUserMeta(id);
// };
//
// module.exports = { getMeta };
