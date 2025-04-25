import { getSignedUrlAndPost } from "./getSignedUrlAndPost";

const data = {
  example: "json",
  and: "rest of the values",
};
const environment = "production"; // or "staging"
const accountId = "2489"; // you get these from Pricen
const token = "2489&&OggsDcY4y0roZtO6YRRHdcX51JBo16zajo40FUnCGK1GWSPiinK6hUo0YRFFap"; // you get these from Pricen
getSignedUrlAndPost(accountId, token, data, environment).then((response) => {
  console.log(response);
});
