import knex from "knex";
import dotenv from "dotenv";
import config, { mssqlConfig } from "../knexfile";
dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
export const db = knex(config[ENVIRONMENT]);
export const dbMssql = knex(mssqlConfig[ENVIRONMENT]);
