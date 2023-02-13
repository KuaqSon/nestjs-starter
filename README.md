#Nest Backend Starter

## Features

- [x] Database ([typeorm](https://typeorm.io/)).
- [x] Config Service ([@nestjs/config](https://www.npmjs.com/package/@nestjs/config)).
- [ ] Mailing ([nodemailer](https://www.npmjs.com/package/nodemailer), [@nestjs-modules/mailer](https://www.npmjs.com/package/@nestjs-modules/mailer)).
- [x] Basic Sign in and sign up
- [x] Admin and User roles.
- [ ] File uploads. Support local.
- [x] Swagger.
- [x] E2E and units tests.
- [ ] Docker.

## Quick start

```bash
cp env.example .env

yarn install
```

### Install Redis

From the terminal, run:

```
brew install redis
```

Starting Redis using launchd

```
brew services start redis
```

## Development

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# Or
$ yarn run dev

# production mode
$ npm run start:prod
```

## Swagger

nest API description available at: [localhost:4088/api-docs](http://localhost:4088/api-docs)

## Database utils

Generate migration

```bash
yarn run migration:generate
```

Run migration

```bash
yarn run migration:run
```

Revert migration

```bash
yarn run migration:revert
```

Drop all tables in database

```bash
yarn run schema:drop
```

## Tests

```bash
# unit tests
npm run test

# e2e tests
npm run test:e2e
```

## Nest CLI

### New resources

```
npx nest g resource modules/<resource name>
```


## Deployment


1. Prepare environment file
2. Run docker build and up command by using `production-dc.yml`


```bash
docker-compose -f production-dc.yml build

docker-compose -f production-dc.yml up -d
```
