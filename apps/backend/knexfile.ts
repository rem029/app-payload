import type { Knex } from "knex";
import dotenv from "dotenv";
dotenv.config();

interface KnexConfig {
  [key: string]: Knex.Config;
}

const defaultConfig: Knex.Config = {
  client: "pg",
  connection: process.env.CONNECTION_STRING_PG,
  migrations: {
    directory: "./db/migrations",
  },
  debug: true,
  log: {
    debug: (msg) => console.log(msg),
    warn: (msg) => console.log(msg),
    error: (msg) => console.log(msg),
  },
};

const mssqlDefaultConfig: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.CONNECTION_DB_MSSQL_USER,
    password: process.env.CONNECTION_DB_MSSQL_PWD,
    database: process.env.CONNECTION_DB_MSSQL_NAME,
    server: process.env.CONNECTION_DB_MSSQL_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true,
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  },
  debug: true,
  log: {
    debug: (msg) => console.log(msg),
    warn: (msg) => console.log(msg),
    error: (msg) => console.log(msg),
  },
};

const mssqlProdConfig: Knex.Config = {
  client: "mssql",
  connection: {
    user: process.env.CONNECTION_DB_MSSQL_USER,
    password: process.env.CONNECTION_DB_MSSQL_PWD,
    database: process.env.CONNECTION_DB_MSSQL_NAME,
    server: process.env.CONNECTION_DB_MSSQL_SERVER,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  },
  debug: true,
  log: {
    debug: (msg) => console.log(msg),
    warn: (msg) => console.log(msg),
    error: (msg) => console.log(msg),
  },
};

const pgConfig: KnexConfig = {
  development: {
    ...defaultConfig,
  },
  production: {
    ...defaultConfig,
  },
};

export const mssqlConfig: KnexConfig = {
  development: {
    ...mssqlDefaultConfig,
  },
  production: {
    ...mssqlProdConfig,
  },
};

export default pgConfig;
