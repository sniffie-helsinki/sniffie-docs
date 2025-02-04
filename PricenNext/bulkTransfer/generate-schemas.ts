const path = require('path');
const { generate } = require('openapi-typescript-validator');

generate({
  schemaFile: path.join(__dirname, 'bulk-upload-openapi.yaml'),
  schemaType: 'yaml',
  directory: path.join(__dirname, '/schemas')
})