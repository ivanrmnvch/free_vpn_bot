const { createLogger, format, transports } = require('winston');
const path = require('node:path');
let chalk;

(async () => {
	chalk = await import('chalk').then((data) => data.default);
})();

/** Функция для удаления ANSI escape кодов */
const stripAnsi = (string) => string.replace(/\x1B\[[0-9;]*m/g, '');

const logger = createLogger({
	level: 'info',
	format: format.combine(
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss.SSS',
		}),
		format.printf((params) => {
			const style =
				params.level === 'error'
					? {
							info: chalk.bold.redBright,
							text: chalk.red,
						}
					: {
							info: chalk.bold.greenBright,
							text: chalk.green,
						};

			const timestamp = chalk.blue(`[${params.timestamp}]`);
			const level = style.info(`[${params.level.toUpperCase()}]`);
			const label = params.label ? style.info(` [${params.label}]`) : '';
			const stack = params.stack
				? `${chalk.bold.redBright('\n[Stack]')}: ${params.stack}\n`
				: '';
			const meta = params.meta
				? `${chalk.bold.magentaBright('[Meta]')}: ${chalk.magenta(JSON.stringify(params.meta))}`
				: '';
			const message = `${style.text(params.message)}${meta ? ' ' : ''}`;

			const log = `${timestamp} ${level}${label}: ${message}${stack}${meta}`;

			return {
				original: log,
				clean: stripAnsi(log),
			};
		})
	),
	transports: [
		new transports.Console({
			format: format.printf((params) => params[Symbol.for('message')].original),
		}),
		new transports.File({
			filename: path.resolve(__dirname, '../../logs/error.log'),
			level: 'error',
			format: format.printf((params) => params[Symbol.for('message')].clean),
		}),
		new transports.File({
			filename: path.resolve(__dirname, '../../logs/combined.log'),
			format: format.printf((params) => params[Symbol.for('message')].clean),
		}),
	],
});

const dataTransform = (data = {}) => {
	const ctx = data?.update ? Object.values(data.update).pop() : null;
	return ctx
		? {
				ctx: {
					from: ctx.from,
					data: ctx?.data,
					text: ctx?.text,
					successful_payment: ctx?.successful_payment,
				},
			}
		: { ...data };
};

module.exports = {
	logInfo: (message, label, data) => {
		logger.info(message, {
			label,
			meta: dataTransform(data),
		});
	},
	logError: (message, label, error) => {
		const {
			stack,
			name,
			ctx: data,
			method,
			payload,
			ok,
			error_code,
			description,
			parameters,
		} = error;
		logger.error(message, {
			stack,
			meta: {
				...dataTransform(data),
				type: name,
				method,
				payload,
				ok,
				error_code,
				description,
				parameters,
			},
			label,
		});
	},
};
