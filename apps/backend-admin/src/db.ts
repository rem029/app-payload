import knex from "knex";
import dotenv from "dotenv";
import config from "./knexfile";
dotenv.config();

const ENVIRONMENT = process.env.NODE_ENV ? process.env.NODE_ENV : "development";
export const dbKnex = knex(config[ENVIRONMENT]);
