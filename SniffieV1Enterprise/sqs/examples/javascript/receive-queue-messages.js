import axios from 'axios';
import config from './config.js';

if (!config || !config['sqsUrl']){
  throw new Error("No sqsUrl")
}

const numberOfMessages = 10; // how many messages sqs server should return, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html#SQS-ReceiveMessage-request-MaxNumberOfMessages
const url = config['sqsUrl'];
console.log(`Fetching queue attributes from ${url}`)

const getMessages = async (url) => {
  /*

  This function fetches messages from the sqs url

  If you get 404, double check your queue url
  If you get 403, double check your queue url and make sure the request
  is coming from a whitelisted IP address
  If you get 400, your request is malformed

  */

  // since the function is async, we can use await 

  const response = await axios({
    method: 'get',
    url: url,
    responseType: 'json'
  });

  // we got the response. we will now iterate them through and return messagelist 
  const messageList = response?.data?.ReceiveMessageResponse?.ReceiveMessageResult?.messages;
  return messageList
};

const deleteMessageFromSqs = async (url, messageList) => {
  /*
  This function deletes messages from an SQS queue
  */
  if (messageList.length === 0){
    console.log('Message list was empty. Not doing anything');
    return;
  }

  // first we create entries array according to AWS docs
  const entries = [];
  for (let i = 0; i < messageList.length; i++){
    const tmp = messageList[i];
    entries.push({ Id: tmp.MessageId, ReceiptHandle: tmp.ReceiptHandle });
  }

  // create final payload
  const payload = { QueueUrl: url, Entries: entries }

  // we need time in iso 8601 format for headers

  const date = new Date().toISOString();

  // add headers
  const headers = {
    'Content-Type': 'application/x-amz-json-1.0',
    'X-Amz-Target': 'AmazonSQS.DeleteMessageBatch',
    'X-Amz-Date': date,
    'Connection': 'Keep-Alive'
  }

  // now call the endpoint with POST, again with await
  const response = await axios({
    method: 'post',
    url: url,
    headers: headers,
    data: payload
  });

  // successfull reqponses have response.data in them so we assume the request is successful

  if (response.data.Failed){ // there are some failed messages. added logic here
    console.log('some messages failed to be deleted, logging...')
    for (let i = 0; i < response.data.Failed.length; i++){ // loop failed deletions: you should log these, fix errors and then retry these
      console.log('failed message:', response.data.Failed[i]);
    }
    return false
  }
  return true;
}

let continueProcessing = true;
const finalUrl = `${url}?Action=ReceiveMessage&MaxNumberOfMessages=${numberOfMessages}`

while (continueProcessing) { // we continue this loop until there continue_processing != true, and this happens either with error or if received message number is less than the numberOfMessages
  let messageList = [];
  try{
    messageList = await getMessages(finalUrl);
  } catch(err){ // some error happened. log it, and break the loop
    console.log({ err });
    break;
  }

  if (!messageList){ // message list is null or empty, we can break
    console.log('messageList is null, breaking');
    break;
  }

  // we now have message list

  if (messageList.length < numberOfMessages){ // less messages received than in the number of messages => this is the last batch of messages
    continueProcessing = false;
    console.log(`This is the lsast loop as message list length (${messageList.length}) < ${numberOfMessages}. Stopping message receives`);
  }

  if (messageList.length > 0){

    // YOUR YOUR LOGIC TO HANDLE MESSAGES HERE

    // finally, we send receipt handles back to the SQS so that the message is removed from the queue
    const deletionOk = deleteMessageFromSqs(url, messageList);
    if (deletionOk){
      console.log('deletion was ok');
    } else {
      console.log('some deletions failed')
    }
  }

  break;
}

