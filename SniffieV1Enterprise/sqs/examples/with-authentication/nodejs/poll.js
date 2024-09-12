const AWS = require('aws-sdk');
const sqs = new AWS.SQS();
const queue = ''; // queue url: string, get this from Sniffie
const env = 'staging';
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
async function getTempCredentials() {
	try {
		const response = await fetch(config.url, config);
		const { data } = await response.json();
		return data.stsCredentials;
	} catch (error) {
		console.log(error);
	}
}
async function pollSqsQueue(url, credentials) {
	AWS.config.update({
		accessKeyId: credentials.AccessKeyId,
		secretAccessKey: credentials.SecretAccessKey,
		sessionToken: credentials.SessionToken,
		region: 'eu-north-1',
	});
	const sqs = new AWS.SQS();

	const params = {
		QueueUrl: url,
		MaxNumberOfMessages: 10,
		VisibilityTimeout: 30,
		WaitTimeSeconds: 20,
	};
	try {
		const data = await sqs.receiveMessage(params).promise();
		console.log(data);
		return data;
	} catch (err) {
		console.log(err);
	}
}

async function processMessage(message) {
	console.log('Processing message: %j', message);
	// TODO implement business logic
	return true;
}

async function pollAndProcessMessages() {
	// get temporary credentials
	const credentials = await getTempCredentials();
	// poll sqs queue
	const data = await pollSqsQueue(queue, credentials.Credentials);
	// init message delete call
	const deleteParams = {
		QueueUrl: queue,
		Entries: [],
	};
	if(!data?.Messages) {
		console.log('No messages to process');
		return 'Bye bye!';
	}
	const promises = data?.Messages?.map(async (message) => {
		deleteParams.Entries.push({
			Id: message.MessageId,
			ReceiptHandle: message.ReceiptHandle,
		});
		await processMessage(message);
	});
	await Promise.all(promises);
	// delete messages
	await sqs.deleteMessageBatch(deleteParams).promise();
	console.log(
		'This is just one iteration, you should run this in a loop, until all messages have been processed'
	);
	return 'Bye bye!';
}
pollAndProcessMessages().then((result) => console.log(result));
