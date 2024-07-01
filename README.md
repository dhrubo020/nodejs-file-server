## Description

This project contains REST APIs for uploading, retrieving, and deleting files using [NestJS](https://github.com/nestjs/nest).
The special feature of this project is that you can upload files to AWS S3, GCP Bucket, Azure, and Local storage just by changing your environment configuration.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run the test files

```bash
# unit tests
$ npm run test:jest
```

## ENV

```bash
STORAGE_PROVIDER = LOCAL or S3_BUCKET or GCP_BUCKET
```

## Author

- [Dhrubo](https://www.linkedin.com/in/dnsdhrubo/)
