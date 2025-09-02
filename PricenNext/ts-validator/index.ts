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
	return {valid: result.valid, errors: result.errors};
}

export async function validateProduct(req: { [key: string]: any }) {
	const path = '/validate/product';
	const method = 'POST';
	return validateRequest(req, path, method);
}

export async function validateOrder(req: { [key: string]: any }) {
	const path = '/validate/order';
	const method = 'POST';
	return validateRequest(req, path, method);
}

export async function validateCompetitor(req: { [key: string]: any }) {
	const path = '/validate/competitor';
	const method = 'POST';
	return validateRequest(req, path, method);
}

export async function validateStoreProduct(req: { [key: string]: any }) {
	const path = '/validate/store-product';
	const method = 'POST';
	return validateRequest(req, path, method);
}

export async function validateStore(req: { [key: string]: any }) {
	const path = '/validate/store';
	const method = 'POST';
	return validateRequest(req, path, method);
}

export async function validateSupplementalData(req: { [key: string]: any }) {
	const path = '/validate/supplemental-data';
	const method = 'POST';
	return validateRequest(req, path, method);
}
