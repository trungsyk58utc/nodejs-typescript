FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

RUN yarn global add pm2

RUN yarn build

COPY src/docs dist/docs

CMD ["pm2-runtime", "ecosystem.config.js"]