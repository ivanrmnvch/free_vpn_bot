init-folders:
	mkdir logs \
	&& echo "" > logs/combined.log \
	&& echo "" > logs/error.log

copy-env:
	cp .env.example .env

