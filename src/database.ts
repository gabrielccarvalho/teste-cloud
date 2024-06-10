import pkg from "knex";
const { knex: setupKnex } = pkg;

export const knex = setupKnex({
	client: "sqlite",
	connection: {
		filename: "./tmp/app.db",
	},
});
