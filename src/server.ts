import fastify from "fastify";
import { env } from "./env";
import { todosRoutes } from "./routes/todos";

import cors from "@fastify/cors";

const app = fastify();

await app.register(cors, {
	origin: "*",
});

app.register(todosRoutes, {
	prefix: "todos",
});

app
	.listen({
		port: env.PORT,
	})
	.then(() => {
		console.log("HTTP Server Running 🚀");
	});
