const zlib = require("zlib");
async function createS3UploadForm(args: {
  url: string;
  data: object;
}): Promise<unknown> {
  const { url, data } = args;

  if (!data) {
    throw new Error("Cannot create s3 upload form without data");
  }
  const requestHeaders = new Headers();
  requestHeaders.append("Content-Encoding", "gzip");
  requestHeaders.append("Content-Type", "application/json");
  const requestOptions = {
    method: "PUT",
    headers: requestHeaders,
    body: zlib.gzipSync(JSON.stringify(data)),
    redirect: "follow",
  };
  return upload(url, requestOptions);
}
// @ts-ignore request options type is not available
const upload = async (url: string, requestOptions) => {
  return new Promise((resolve, reject) => {
    fetch(url, requestOptions)
      .then((response) => response.text())
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
