import pkg, { type Knex } from "knex";
import { env } from "./env";
const { knex: setupKnex } = pkg;

export const config: Knex.Config = {
	client: "sqlite",
	connection: {
		filename: env.DATABASE_URL,
	},
	useNullAsDefault: true,
	migrations: {
		extension: "ts",
		directory: "./db/migrations",
	},
};

export const knex = setupKnex(config);
