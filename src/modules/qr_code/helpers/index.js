const { API } = require('../../../utils/api');
const stream = require('stream');
const { InputFile } = require('grammy');
const { logInfo, logError } = require('../../../utils/logger');

const label = 'qrCode';

const generateQRCode = async (id, code) => {
	try {
		logInfo('QR code generation', label, { id, code });
		const QRCodeStream = await API.get('vpn-services', {
			params: { id, code },
			responseType: 'stream',
		});

		const passThroughStream = new stream.PassThrough();
		QRCodeStream.pipe(passThroughStream);
		return new InputFile(passThroughStream);
	} catch (e) {
		logError('QR code generation error', label, e);
		return null;
	}
};

module.exports = { generateQRCode };
