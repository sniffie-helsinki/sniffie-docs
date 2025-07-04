const fs = require("fs");
// @ts-ignore different files
const path = require("path");
console.log("Schemas generated successfully, running post script to fix the decoder.ts.");
const filePath = path.join(__dirname, "schemas/decoders.ts");
const fileContent = fs.readFileSync(filePath, "utf8");


let newContent = fileContent.replace(
  /const ajv = new Ajv\(\{ strict: false \}\);/g,
  "const ajv = new Ajv({strict: false, allErrors: true});"
);
// delete the line ajv.compile(jsonSchema);
newContent = newContent.replace(
  /^.*ajv\.compile\(jsonSchema\);\s*$/gm,
  ""
);
// use a regex to replace the line that starts with "addFormats(" and any characters after that (you need to use wildcard) with the same line but with a line break and ajv.compile(jsonSchema);
newContent = newContent.replace(
  /^.*addFormats\(.*\);.*$/gm,
    (  match: string) => `${match}
ajv.compile(jsonSchema);`
);

fs.writeFileSync(filePath, newContent, "utf8");
