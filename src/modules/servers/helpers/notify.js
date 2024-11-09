module.exports = async (ctx, text) => {
	if (ctx.update.callback_query) {
		await ctx.answerCallbackQuery({
			text,
			show_alert: true,
		});
	} else {
		await ctx.reply(text);
	}
};
