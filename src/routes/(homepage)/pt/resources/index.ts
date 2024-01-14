export const getResourceOverview = async () => {
	const files = import.meta.glob<Record<string, any>>('./**/*.ts');
	const resources: Record<string, { title: string; code: string }[]> = {};
	const entries = Object.entries(files);
	for (let i = 0; i < entries.length; i++) {
		const [path, page] = entries[i];
		const category = path.split('/')[1];
		if (!path.includes('types')) {
			const title = (await page()).title;
			const code = path.split('/')[2].replace('.ts', '');
			const entry = { title, code };
			category in resources ? resources[category].push(entry) : (resources[category] = [entry]);
		}
	}
	return resources;
};

export const getResource = async (chapter: string, courseCode: string) => {
	try {
		const data = (await import(`./${chapter}/${courseCode}`)).default;
		return data;
	} catch (e) {
		console.error(`Unable to find resource ${courseCode} in chapter ${chapter}`, e);
		return null;
	}
};
