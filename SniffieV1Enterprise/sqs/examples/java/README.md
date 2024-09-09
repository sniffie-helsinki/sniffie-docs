# SQS example code (Python)

This folder contains code examples for Python on how to fetch data from an AWS SQS queue. For more information on AWS SQS queues and development, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html

## Requirements
1. Java installed in the system
2. An SQS queue you have access to

Code examples in this folder are bare-bones assuming you are working with default packages. 

## Best practices

Instead of requesting for new messages every second, you should instead poll the message attributes, especially the number of messages available.

When messages are available, the process that polls the message attributes should trigger message fetcher process(es). If the number of messages keeps on rising despite you having a message fetcher process on, you should consider spawning multiple message fetcher processes

A message fetcher process (or processes):

1. fetch messages in the desired batches (default 10)
2. save and process those messages to your system.
3. stop fetching messages if the received message count is less than the desired batch size.

We recommend that you fetch the messages first, store those on your side somehow  (e.g. save to database, save to disk, send to your own queue, send to lambda functions or something else) and then mark the message as as received as fast as possible.

We recommend that you have another process or processes in place which handle the processing of those messages after you have saved them on your side. For fast saving, we recommend either saving to a database, saving to disk, passing the messages to lambda functions or to your own queues.

You could also process the messages before you mark them as received. However, if you work with multiple concurrent fetcher processes due to the large amount of messages due to very large volumes, this may create unnecessary duplicate message fetches from SQS to your your side. This is more likely to happen if the processing of a message takes a long time or there are many messages. Thus you should always first fetch the messages, store those fast and securely on your end and then mark the fetched messages received so that you will then get the next batch of messages and the same ones won't keep on appearing. 

We also recommend that you add local alerting on the failed messages or failed processing of the messages. This is especially true in business critical messages such as incoming price changes or Omnibus objects.

## Before running for the first time

1. Copy `config.txt.example` to `config.txt` and fill the necessary details.
