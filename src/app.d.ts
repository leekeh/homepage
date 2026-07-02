interface D1PreparedStatement {
	bind(...values: unknown[]): D1PreparedStatement;
	run(): Promise<{ success: boolean; error?: string }>;
	all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
	first<T = Record<string, unknown>>(): Promise<T | null>;
}

interface D1Database {
	prepare(query: string): D1PreparedStatement;
}

declare global {
	namespace App {
		interface Platform {
			env: {
				DB: D1Database;
			};
		}
	}
}

export {};
