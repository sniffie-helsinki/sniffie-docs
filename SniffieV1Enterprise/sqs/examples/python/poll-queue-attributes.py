'''
This code example assumes that you don't have AWS infrastrucure in place

If you are using AWs in your own organization, you likely want to use AWS SDK with AWS specific examples.
'''

from urllib.request import urlopen 
from xml.etree.ElementTree import fromstring, ElementTree
import json
import sys
import re

config = None


# Open the config file and read it to a dictionary
with open("config.json") as f: # open config file
  config = json.load(f)
f.close()

if config == None:
  print("config json is still None, exiting. make sure config file exists")
  sys.exit()
elif not "sqs-url" in config:
  print("config json does not have sqs-url. make sure sqs-url key exists")
  sys.exit()
elif not config["sqs-url"]:
  print("sqs-url is not present. make sure sqs-url value is present")
  sys.exit()

# We now read the url to variable

queue_url = config["sqs-url"]
print(f"Fetching queue attributes from {queue_url}")

'''
Add the GetAttributes action at the end of the queue url.

Here we are fetching only ApproximateNumberOfMessages, but you can also fetch other  attributes, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html

If you want all attributes, use AttributeNames=All
'''

final_url = f"{queue_url}?Action=GetQueueAttributes&AttributeNames=ApproximateNumberOfMessages"

'''
Next, we open the url and fetch the desired attributes

If you get 404, double check your queue url
If you get 403, double check your queue url and make sure the request
is coming from a whitelisted IP address
If you get 400, your request is malformed
'''
response = urlopen(final_url)

# We now read the response. We know that we will get xml in the response so we'll convert this to xml
content = str(response.read(), "utf-8")
tree = ElementTree(fromstring(content))

# Create dictionary for which we store the attribute names in dictionary
attribute_dict = {}

# iterate the xml result
for res in tree.findall(".//{http://queue.amazonaws.com/doc/2012-11-05/}GetQueueAttributesResult"):
  for attribute in res.findall(".//{http://queue.amazonaws.com/doc/2012-11-05/}Attribute"): # iterate all attributes
    name = attribute.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}Name").text
    value = attribute.find(".//{http://queue.amazonaws.com/doc/2012-11-05/}Value").text
    attribute_dict[name] = value

# Now we can store / check for the desired attributes. We check here only if messages available

if "ApproximateNumberOfMessages" in attribute_dict:
  message_count = int(attribute_dict["ApproximateNumberOfMessages"]) # cast to int
  if message_count > 0:
    print(f"There are {message_count} messages available, these should be fetched!")    
  else:
    print("No messages available")
