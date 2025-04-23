const path = require("path");
const { generate } = require("openapi-typescript-validator");
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({format: "full", strict: false, allErrors: true, verbose: true});
addFormats(ajv);

generate({
  schemaFile: path.join(__dirname, "bulk-upload-openapi.yaml"),
  schemaType: "yaml",
  directory: path.join(__dirname, "/schemas"),
  addFormats: true,
  formatOptions: ["double", "date-time"],
});
