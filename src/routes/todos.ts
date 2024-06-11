import crypto from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../database";

export async function todosRoutes(app: FastifyInstance) {
	// Get all todos
	app.get("/", async (_, reply: FastifyReply) => {
		const todos = await knex("todo").select("*");

		return reply.status(200).send(todos);
	});

	// Get a specific todo given an id
	app.get("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
		const getTodoParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = getTodoParamsSchema.parse(request.params);

		const todo = await knex("todo").where({ id: id }).first();

		return reply.status(200).send(todo);
	});

	// Create a new todo
	app.post("/create", async (request: FastifyRequest, reply: FastifyReply) => {
		const createTodoSchema = z.object({
			title: z.string(),
			description: z.string(),
			category: z.enum(["home", "work", "personal", "shopping"]),
			priority: z.enum(["low", "normal", "high", "critical"]),
			evaluation_points: z.number().optional(),
			due_date: z.string(),
		});

		const body = createTodoSchema.parse(request.body);

		const {
			title,
			description,
			category,
			priority,
			due_date,
			evaluation_points,
		} = body;

		await knex("todo")
			.insert({
				id: crypto.randomUUID(),
				title,
				description,
				category,
				priority,
				evaluation_points,
				due_date,
			})
			.returning("*");

		return reply.status(201).send();
	});

	// Delete a todo given an id
	app.delete("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
		const deleteTodoParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = deleteTodoParamsSchema.parse(request.params);

		await knex("todo").where({ id: id }).del();

		return reply.status(204).send();
	});

	// Update one or more fields of a todo given an id
	app.put("/:id", async (request: FastifyRequest, reply: FastifyReply) => {
		const updateTodoParamsSchema = z.object({
			id: z.string().uuid(),
		});

		const { id } = updateTodoParamsSchema.parse(request.params);

		const updateTodoBodySchema = z.object({
			title: z.string().optional(),
			description: z.string().optional(),
			category: z.enum(["home", "work", "personal", "shopping"]).optional(),
			priority: z.enum(["low", "normal", "high", "critical"]).optional(),
			status: z.enum(["todo", "done"]).optional(),
			evaluation_points: z.number().optional(),
			due_date: z.string().optional(),
		});

		const body = updateTodoBodySchema.parse(request.body);

		const {
			title,
			description,
			category,
			priority,
			status,
			due_date,
			evaluation_points,
		} = body;

		await knex("todo").where({ id: id }).update({
			title,
			description,
			category,
			priority,
			status,
			evaluation_points,
			due_date,
		});

		return reply.status(204).send();
	});

	// Filter a todo by priority
	app.get(
		"/priority/:priority",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const getTodoByPriorityParamsSchema = z.object({
				priority: z.enum(["low", "normal", "high", "critical"]),
			});

			const { priority } = getTodoByPriorityParamsSchema.parse(request.params);

			const todos = await knex("todo").where({ priority });

			return reply.status(200).send(todos);
		},
	);

	// Filter a todo by category
	app.get(
		"/category/:category",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const getTodoByCategoryParamsSchema = z.object({
				category: z.enum(["home", "work", "personal", "shopping"]),
			});

			const { category } = getTodoByCategoryParamsSchema.parse(request.params);

			const todos = await knex("todo").where({ category });

			return reply.status(200).send(todos);
		},
	);

	// Filter a todo by status
	app.get(
		"/status/:status",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const getTodoByStatusParamsSchema = z.object({
				status: z.enum(["todo", "done"]),
			});

			const { status } = getTodoByStatusParamsSchema.parse(request.params);

			const todos = await knex("todo").where({ status });

			return reply.status(200).send(todos);
		},
	);

	// Filter a todo by evaluation points
	app.get(
		"/points/:evaluation_points",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const getTodoByEvaluationPointsParamsSchema = z.object({
				evaluation_points: z.string(),
			});

			const { evaluation_points } = getTodoByEvaluationPointsParamsSchema.parse(
				request.params,
			);

			const todos = await knex("todo").where({
				evaluation_points: Number(evaluation_points),
			});

			return reply.status(200).send(todos);
		},
	);

	// Filter a todo by due date
	app.get(
		"/due_date/:due_date",
		async (request: FastifyRequest, reply: FastifyReply) => {
			const getTodoByDueDateParamsSchema = z.object({
				due_date: z.string(),
			});

			const { due_date } = getTodoByDueDateParamsSchema.parse(request.params);

			const todos = await knex("todo").where({ due_date });

			return reply.status(200).send(todos);
		},
	);
}
