# build
FROM node:16 as react-build
WORKDIR /app
COPY . ./
RUN yarn
RUN yarn build

CMD ["yarn", "start"]