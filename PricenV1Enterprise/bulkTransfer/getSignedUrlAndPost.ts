import createAndPostS3UploadForm from "./createAndPostS3UploadForm";
import request, { CoreOptions } from "request";

const getSignedUrl = async (
  accountId: string,
  options: CoreOptions
): Promise<{ data: { url: string } }> => {
  return new Promise((resolve, reject) => {
    request(
      `https://api-staging.sniffie.io/v1/account-products/${accountId}/products/bulk-transfer`,
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

export const getSignedUrlAndPost = async (
  accountId: string,
  token: string,
  data: object
) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };
  const response = await getSignedUrl(accountId, options);

  return await createAndPostS3UploadForm({
    url: response?.data?.url,
    data,
  });
};
