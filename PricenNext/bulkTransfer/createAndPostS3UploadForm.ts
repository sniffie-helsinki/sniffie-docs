const zlib = require("zlib");
async function createS3UploadForm(args: {
  url: string;
  fields: { [key: string]: string };
  data: object;
}): Promise<unknown> {
  const { url, fields, data } = args;

  if (!data) {
    throw new Error("Cannot create s3 upload form without data");
  }
  const form = new FormData();
  Object.entries(fields).forEach(([field, value]) => {
    form.append(field, value);
  });
  const compressedData = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(JSON.stringify(data), (err: any, result: Buffer<ArrayBufferLike> | PromiseLike<Buffer<ArrayBufferLike>>) => {
      if (err) reject(err);
      else resolve(result);
    });
  });
  const blob = new Blob([compressedData], { type: "application/gzip" });
  form.append("file", blob);

  const requestOptions = {
    method: "POST",
    body: form,
    redirect: "follow",
  };
  return upload(url, requestOptions);
}
// @ts-ignore request options type is not available
const upload = async (url: string, requestOptions) => {
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => {
        console.log(response.statusText);
        console.log(response.status);
        return response.text()})
      .then((result) => {
        console.log(result);
        resolve(result);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
};
export default createS3UploadForm;
