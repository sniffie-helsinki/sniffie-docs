import {
	SQSClient,
	ReceiveMessageCommand,
	DeleteMessageBatchCommand,
} from '@aws-sdk/client-sqs';

// Fill in the variables
const queue = ''; // queue url: string, get this from Sniffie
const env = process.env.ENV; // blank or staging, if you are using staging environment
const accountId = null; // accountId: number, get this from Sniffie
const apiKey = ''; // apiKey: string, get this from Sniffie

let config = {
	method: 'get',
	maxBodyLength: Infinity,
	url: `https://api${
		env === 'staging' ? '-staging' : ''
	}.sniffie.io/v1/account-products/${accountId}/get-queue-credentials?queue=${queue}`,
	headers: {
		Authorization: apiKey,
	},
};
let sqsClient: SQSClient;
async function getTempCredentials() {
	try {
		const response = await fetch(config.url, config);
		const { data } = await response.json();
		return data.stsCredentials.Credentials;
	} catch (error) {
		console.log(error);
	}
}

async function pollQueue() {
	const credentials = await getTempCredentials();
	sqsClient = new SQSClient({
		region: 'eu-north-1',
		credentials: {
			accessKeyId: credentials.AccessKeyId,
			secretAccessKey: credentials.SecretAccessKey,
			sessionToken: credentials.SessionToken,
		},
	});
	try {
		const receiveMessageCommand = new ReceiveMessageCommand({
			QueueUrl: queue,
			MaxNumberOfMessages: 10,
			VisibilityTimeout: 30, // adjust as needed
			WaitTimeSeconds: 20,
		});

		const data = await sqsClient.send(receiveMessageCommand);

		if (data.Messages) {
			for (const message of data.Messages) {
				await processMessage(message);
			}

			const deleteParams = {
				QueueUrl: queue,
				Entries: data.Messages.map((message) => ({
					Id: message.MessageId!,
					ReceiptHandle: message.ReceiptHandle!,
				})),
			};

			const deleteMessageBatchCommand = new DeleteMessageBatchCommand(
				deleteParams
			);
			await sqsClient.send(deleteMessageBatchCommand);
		} else {
			console.log('No messages to process');
			return 'Queue is empty';
		}
		console.log(
			'This is just one iteration, you should run this in a loop, until all messages have been processed'
		);
		return 'Bye bye!';
	} catch (error) {
		console.error('Error polling the queue:', error);
	}
}

async function processMessage(message: any) {
	// Implement your message processing logic here
	console.log('Processing message:', message);
}

// Start polling the queue
pollQueue().then((result) => console.log(result));
