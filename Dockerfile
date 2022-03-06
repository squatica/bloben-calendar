FROM node:16.14.0-stretch-slim

WORKDIR /usr/app/tmp
ENV NODE_ENV development

COPY . ./
RUN mkdir .husky
RUN npm i

ENV NODE_ENV production
RUN npm run build

WORKDIR /usr/app
RUN cp -r ./tmp/build ./calendar/

RUN rm -r ./tmp
