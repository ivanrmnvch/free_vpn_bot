TG_BOT = tg_bot

init-folders:
	mkdir logs \
	&& echo "" > logs/combined.log \
	&& echo "" > logs/error.log

copy-env:
	cp .env.example .env

build-dev:
	APP_MODE=development docker compose build --no-cache $(TG_BOT)

dev:
	APP_MODE=development docker compose up --watch $(TG_BOT)

