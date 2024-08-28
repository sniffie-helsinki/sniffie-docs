import createAndPostS3UploadForm from "./createAndPostS3UploadForm";
import request, { CoreOptions } from "request";

const getSignedUrl = async (
  options: CoreOptions
): Promise<{ data: { url: string } }> => {
  return new Promise((resolve, reject) => {
    request(
      "https://api-staging.sniffie.io/v1/account-products/676/products/bulk-transfer",
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

export const getSignedUrlAndPost = async () => {
  const options = {
    method: "GET",
    headers: {
      Authorization: "676&&oA&hCXi$x**TH#sA810Sv2",
    },
  };
  const response = await getSignedUrl(options);

  return await createAndPostS3UploadForm({
    url: response?.data?.url,
    data: {
      example: "json",
      and: "rest of the values",
    },
  });
};
