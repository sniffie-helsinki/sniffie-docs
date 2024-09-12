import axios from 'axios';
import config from './config.js';

if (!config || !config['sqsUrl']){
  throw new Error("No sqsUrl")
}

const url = config['sqsUrl'];
console.log(`Fetching queue attributes from ${url}`)

/*

Add the GetAttributes action at the end of the queue url.

Here we are fetching only ApproximateNumberOfMessages, but you can also fetch other  attributes, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html

If you want all attributes, use AttributeNames=All

*/

const finalUrl = `${url}?Action=GetQueueAttributes&AttributeNames=ApproximateNumberOfMessages`

/*

Next, we open the url and fetch the desired attributes

If you get 404, double check your queue url
If you get 403, double check your queue url and make sure the request
is coming from a whitelisted IP address
If you get 400, your request is malformed

*/

axios({
  method: 'get',
  url: finalUrl,
  responseType: 'json'
}).then((response) => {
  const attributes = response?.data?.GetQueueAttributesResponse?.GetQueueAttributesResult?.Attributes
  if (!attributes || attributes.length === 0){ // no attributes received, throw error (you may want to see what the attributes object looks like)
    throw new Error("No queue attributes in response. ")
  }
  
  // If we fetch only one attribute, we know that the array length === 1, so we can just directly point there. If we fetch all attributes, array length > 1, you want to do something else (e.g. loop).

  const desiredAttribute = attributes[0];
  console.log(`${desiredAttribute.Name}: ${desiredAttribute.Value}`)
  if (desiredAttribute.Name === 'ApproximateNumberOfMessages' && desiredAttribute.Value > 0){ // There are messages to be received. We don't need to convert Value to Int, since JavaScript string e.g. '1' > 0.
    console.log('There are messages to be received.'); 

    // YOUR CODE TO TRIGGER MESSAGE RECEIVER HERE
    
  }
})