'''
This code example assumes that you don't have AWS infrastrucure in place

If you are using AWs in your own organization, you likely want to use AWS SDK with AWS specific examples.
'''

from xml.etree.ElementTree import fromstring, ElementTree

import requests
import json
import sys
import datetime

NUMBER_OF_MSG = 10 # how many messages sqs server should return, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_ReceiveMessage.html#SQS-ReceiveMessage-request-MaxNumberOfMessages

config = None

# Open the config file and read it to a dictionary
with open("config.json") as f: # open config file
  config = json.load(f)
f.close()

if config == None:
  print("config json is still None, exiting. make sure config file exists")
  sys.exit()
elif not 'sqs-url' in config:
  print("config json does not have sqs-url. make sure sqs-url key exists")
  sys.exit()
elif not config['sqs-url']:
  print("sqs-url is not present. make sure sqs-url value is present")
  sys.exit()

# We now read the url to variable

queue_url = config['sqs-url']
print(f"Fetching messages from {queue_url}\n")

def get_messages(url):
  '''
  This function fetches messages from the sqs uel

  If you get 404, double check your queue url
  If you get 403, double check your queue url and make sure the request
  is coming from a whitelisted IP address
  If you get 400, your request is malformed
  '''
  response = requests.get(url)

  # We now read the response. We know that we will get xml in the response so we'll convert this to xml and return
  tree = ElementTree(fromstring(response.text))
  return tree

def iterate_messages(tree):
  message_list = []
  # iterate the xml result
  for res in tree.findall(".//{http://queue.amazonaws.com/doc/2012-11-05/}ReceiveMessageResult"): # iterate all attributes
    for message in res.findall(".//{http://queue.amazonaws.com/doc/2012-11-05/}Message"):
      message_id = message.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}MessageId").text
      receipt_handle = message.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}ReceiptHandle").text
      md5 = message.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}MD5OfBody").text
      body = message.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}Body").text
      message_list.append({
          "message_id": message_id,
          "receipt_handle": receipt_handle,
          "md5": md5,
          "body": body,
      })
  print(f"There are {len(message_list)} messages")
  return message_list

def delete_message_from_sqs(queue_url, message_list):
  print(f"Deleting {len(message_list)} messages from the queue...")
  
  # we first create the entries array according to aws docs
  entries = []
  for message in message_list: # loop messages, push to array
    entries.append({ "Id": message["message_id"], "ReceiptHandle": message["receipt_handle"] })

  # create the final payload
  payload = {"QueueUrl": queue_url, "Entries": entries}

  # we need time in ISO 8601 format for headers
  date = datetime.datetime.now().isoformat()
  # add headers
  headers = {
    "Content-Type": "application/x-amz-json-1.0",
    "X-Amz-Target": "AmazonSQS.DeleteMessageBatch",
    "X-Amz-Date": date,
    "Connection": "Keep-Alive"
  }
  # finally, make the request
  res = requests.post(url = queue_url, json = payload, headers = headers)
  response = json.loads(res.text)
  if 'Failed' in response: # some failed, we log these
    print("Some message deletions Failed!, these were: ")
    for item in response['Failed']:
      print(item)
  else:
    print("All messages successfully deleted!")


continue_processing = True
final_url = f"{queue_url}?Action=ReceiveMessage&MaxNumberOfMessages={NUMBER_OF_MSG}"

while continue_processing: # we continue this loop until there continue_processing != True, and this happens either with error or if received message number is less than the NUMBER_OF_MSG

  try:
    tree = get_messages(final_url)
  except: # break processing, print the error, so you can debug. Add your own error handling logic here
    print(traceback.format_exc())
    continue_processing = False
    break

  # We have some element tree object. we now iterate these into a list for easier processing later on (feel free to skip this step if you want higher performance)
  message_list = iterate_messages(tree)
  # We now check if the received message number is less than what we got as the max messages. If yes, we will stop processing after this batch
  if len(message_list) < NUMBER_OF_MSG: # processing should stop, messages not available
    continue_processing = False
    print("This is the last loop. Stopping message receives")

  if len(message_list) > 0:
    # YOUR LOGIC TO HANDLE MESSAGES HERE   
     
    # finally, we send receipt handles back to the queue so that the message is removed
    delete_message_from_sqs(queue_url, message_list)
    print("\n")

print("Loop ended, quitting. \n")
