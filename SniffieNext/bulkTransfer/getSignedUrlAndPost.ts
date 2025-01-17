import createAndPostS3UploadForm from "./createAndPostS3UploadForm";
import request, { CoreOptions } from "request";

const getSignedUrl = async (
  options: CoreOptions
): Promise<{
  data: { uploadUrl: string; uploadFields: { [key: string]: string } };
}> => {
  return new Promise((resolve, reject) => {
    request(
      `https://next-api.sniffie.io/v2/sniffie/bulk-uploads/products-upload-link`,
      options,
      function (error: any, response: any) {
        if (error) {
          reject(error);
        }
        console.log(response.body);
        resolve(JSON.parse(response.body));
      }
    );
  });
};

export const getSignedUrlAndPost = async (token: string, data: object) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };
  const response = await getSignedUrl(options);

  return await createAndPostS3UploadForm({
    url: response?.data?.uploadUrl,
    fields: response?.data?.uploadFields,
    data,
  });
};
