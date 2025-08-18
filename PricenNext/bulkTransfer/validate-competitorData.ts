import { createReadStream } from 'fs';
import readline from 'readline';
import { validateCompetitor } from '../ts-validator';

async function validateData(filePath: string) {
	const fileStream = createReadStream(filePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	for await (const line of rl) {
		try {
			const json = JSON.parse(line);
			const productVariant = await validateCompetitor(json);
			return productVariant;
		} catch (error) {
			console.error('Error parsing JSON', line);
			if (error instanceof Error) {
				console.error(error.message);
			} else {
				console.error('Unknown error', error);
			}
		}
	}
}

validateData('./data/competitorData.jsonl').catch(console.error);
