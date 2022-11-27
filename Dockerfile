FROM node:16-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
RUN apk --no-cache add git
RUN yarn

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
