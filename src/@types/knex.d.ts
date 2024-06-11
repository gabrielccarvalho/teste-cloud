import { Knex } from "knex";

declare module "knex/types/tables" {
	export interface Tables {
		todos: {
			id: string;
			title: string;
			description: string;
			category?: "home" | "work" | "personal" | "shopping";
			priority?: "low" | "normal" | "high" | "critical";
			status: "todo" | "done";
			evaluation_points?: number;
			due_date: Date;
			created_at: Date;
		};
	}
}
