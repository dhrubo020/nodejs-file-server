const {
  DB,
  MONGODB_URI,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

export const dbConfig = {
  db: DB || 'mysql', // mysql, postgresql
  mongodb: {
    URI: MONGODB_URI || 'mongodb://localhost:27017/nodejs-file-server',
  },
  mysql: {
    host: MYSQL_HOST || 'localhost',
    port: parseInt(MYSQL_PORT) || 3306,
    username: MYSQL_USERNAME || 'root',
    password: MYSQL_PASSWORD || '1234',
    database: MYSQL_DATABASE || 'file-server-db',
  },
};
