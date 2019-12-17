# build
FROM node:latest as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

CMD ["yarn", "start"]