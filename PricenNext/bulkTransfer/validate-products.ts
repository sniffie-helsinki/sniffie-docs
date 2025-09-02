import { createReadStream } from "fs";
import readline from "readline";
import { validateProduct } from "../ts-validator";

async function validateData(filePath: string) {
  const fileStream = createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    try {
      const json = JSON.parse(line);
      const { valid, errors } = await validateProduct(json);
      if (valid) {
		console.log("Valid product:", json);
	  } else if (errors && errors.length > 0) {
		console.error("Invalid product:", json);
		const errorMessages = errors.map(err => `  - ${err.schemaPath} ${err.message}`).join("\n");
		console.error("Errors:\n" + errorMessages);
	  } else {
		console.error("Invalid product with unknown errors:", json);
	  }
    } catch (error) {
      console.error("Error parsing JSON", line);
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error", error);
      }
    }
  }
}

validateData("./data/products.jsonl").catch(console.error);
