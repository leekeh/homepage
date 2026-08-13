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

// The standard `blocking` attribute (e.g. `blocking="render"`) isn't in
// Svelte's element attribute types yet; declare it so it type-checks in markup.
declare module 'svelte/elements' {
	// `T` must mirror the original signature for declaration merging, even
	// though this augmentation doesn't reference it.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface HTMLAttributes<T extends EventTarget> {
		blocking?: string;
	}
}

export {};
