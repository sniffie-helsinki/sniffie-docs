# SQS example code (Python)

This folder contains code examples for Python on how to fetch data from an AWS SQS queue. For more information on AWS SQS queues and development, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html

## Requirements
1. Python 3.8+
2. An SQS queue you have access to
3. Ability to install Python packages with pip

Code examples in this folder are bare-bones assuming you are mostly working with default packages + requests. 

## Best practices

Instead of requesting for new messages every second, you should instead poll the message attributes, especially the number of messages available.

When messages are available, the process that polls the message attributes should trigger message fetcher process(es). If the number of messages keeps on rising despite you having a message fetcher process on, you should consider spawning multiple message fetcher processes

A message fetcher process (or processes):

1. fetch messages in the desired batches (default 10)
2. process those messages to your system (e.g. save to disk for later usage, send to your own queue, send the messages lambda function or something else).
3. stop fetching messages if the received message count is less than the desired batch size.

We recommend that you fetch the messages first, store those on your side somehow and then mark the message as as received as fast as possible. We recommend that you have another process or processes which handle the processing of those messages after you have marked them for deletion. For fast saving, we recommend either saving to a database, saving to disk, passing the messages to lambda functions or to your own queues.

You can also process the messages before you mark them as received. However, if you work with multiple concurrent fetcher processes due to the large amount of messages due to very large volumes, this may create unnecessary duplicate message fetches from SQS to your your side. This is more likely to happen if the processing of a message takes a long time. Thus you should first fetch the messages, store those fast and secure and then mark the fetched messages received so that you will then get the next batch of messages and the same ones won't keep on appearing. 

We also recommend that you add local alerting on the failed messages or failed processing of the messages. This is especially true in business critical messages such as incoming price changes or Omnibus objects.

## Before running for the first time

Copy `config.json.example` to `config.json` and fill the necessary details