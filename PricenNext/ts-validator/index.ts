import OpenAPIBackend from 'openapi-backend';
import addFormats from 'ajv-formats';
import addErrors from 'ajv-errors';

const api = new OpenAPIBackend({
	definition: './bulk-upload-openapi.yaml',
	customizeAjv: (ajv) => {
		addFormats(ajv, ['double', 'date-time'] );
        // Enable all errors
        ajv.opts.allErrors = true;
        addErrors(ajv, {
            singleError: false
        })
		return ajv;
	},
});
export async function validateRequest(
	req: { [key: string]: any },
	path: string,
	method: string
) {
	await api.init();
	const result = api.validateRequest({
		method,
		path,
		headers: { 'content-type': 'application/json' },
		body: req,
	});
	if (result.errors) console.error(result.errors);
	return result.valid;
}

