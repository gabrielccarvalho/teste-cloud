import crypto from "node:crypto";
import fastify from "fastify";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app.get("/hello", async () => {
	const todo = await knex("todo")
		.insert({
			id: crypto.randomUUID(),
			title: "Learn TypeScript",
			description: "Learn TypeScript and its features",
			category: "personal",
			priority: "normal",
			due_date: new Date("2024-06-12T12:00:00.000Z"),
		})
		.returning("*");

	return todo;
});

app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log("HTTP Server Running 🚀");
	});
