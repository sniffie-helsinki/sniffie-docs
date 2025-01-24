# Sniffie SQS Poller - Typescript

## Prerequisite
Fill in the variables to poll.ts: 

- const queue = ''; // queue url: string, get this from Sniffie
- const env = process.env.ENV; // blank or staging, if you are using staging environment
- const accountId = null; // accountId: number, get this from Sniffie
- const apiKey = ''; // apiKey: string, get this from Sniffie

## Test
Run `npm install`
After filling in the required variables, execute the poller with run `npx ts-node poll.ts`


## What happens here?
The poller calls the Sniffie REST api to obtain temporary credentials to poll the queue. After the request is successfull, the credentials are injected into the AWS client, which then proceeds to poll the queue for any messages. After the messages have been received and iterated through, we delete the messages in one batch. Make note, that the processing time of the WHOLE batch needs to be less than the VisilibityTimeout set in the request, otherwise the messages will be exposed again for another consumer, and will be reprocessed. 

## What you need to do?
* implement the processMessage() function
* implement the loop in which to call the poller, so that all messages get processed. The example runs only one iteration


## Common errors
Api returns 401: Wrong queue url, wrong api key, wrong accountId
Queue returns no access: Token has expired, fetch new temporary credentials