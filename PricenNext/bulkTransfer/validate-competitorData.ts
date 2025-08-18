import { createReadStream } from 'fs';
import readline from 'readline';
import { validateRequest } from '../ts-validator';

async function validateData(filePath: string) {
	const fileStream = createReadStream(filePath);
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Infinity,
	});

	for await (const line of rl) {
		try {
			const json = JSON.parse(line);
			const productVariant = await validateRequest(
				json,
				'/validate/competitor',
				'POST'
			);
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
