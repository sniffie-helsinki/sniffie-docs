import createAndPostS3UploadForm from "./createAndPostS3UploadForm";
import request, { CoreOptions } from "request";

const getSignedUrl = async (
  options: CoreOptions,
  fileType: string = "products-upload-link",
  env: string = "prod"
): Promise<{
  data: { uploadUrl: string; uploadFields: { [key: string]: string } };
}> => {
  return new Promise((resolve, reject) => {
    request(
      `https://api${env === "prod" ? "" : "-staging"}.pricen.ai/v2/data/bulk-uploads/${fileType}`,
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
  token: string,
  data?: object,
  path?: string,
  fileType?: string,
  env?: string
) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: token,
    },
  };
  const response = await getSignedUrl(options, fileType, env);

  return await createAndPostS3UploadForm({
    url: response?.data?.uploadUrl,
    fields: response?.data?.uploadFields,
    data,
    path,
  });
};
