import OpenAPIBackend from "openapi-backend";
import addFormats from "ajv-formats";

const api = new OpenAPIBackend({
  definition: "../bulk-upload-openapi.yaml",
  customizeAjv: (ajv) => {
    addFormats(ajv);
    return ajv;
  },
});
async function validate(obj) {
  await api.init();

  const result = api.validateRequest({
    method: "POST",
    path: "/pets",
    headers: { "content-type": "application/json" },
    body: { name: "Garfield" },
  });

  if (result.errors) console.error(result.errors);
}
