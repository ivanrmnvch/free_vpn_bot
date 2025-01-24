FROM node:18-alpine

WORKDIR /tg-bot

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD cd src && npx nodemon app.js
