import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
	await knex.schema.createTable("todo", (table) => {
		table.uuid("id").primary();
		table.text("title").notNullable();
		table.text("description").notNullable();
		table
			.enum("category", ["home", "work", "personal", "shopping"])
			.notNullable()
			.defaultTo("personal");
		table
			.enum("priority", ["low", "normal", "high", "critical"])
			.notNullable()
			.defaultTo("normal");
		table.boolean("completed").notNullable().defaultTo(false);
		table.integer("evaluation_points").notNullable().defaultTo(0);
		table.dateTime("due_date").notNullable().defaultTo(knex.fn.now());
		table.timestamp("created_at").defaultTo(knex.fn.now());
	});
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.dropTable("todo");
}
