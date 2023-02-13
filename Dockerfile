FROM node:16.18.1 as production

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

RUN ls -a

RUN yarn install --frozen-lockfile
RUN yarn add @nestjs/cli@9.1.5
RUN yarn run build

CMD ["node", "dist/main"]

# Tell Docker about the port we'll run on.
EXPOSE 4400
