<?php
// Include the config file that contains the SQS URL
include 'config.php'; // This will import $sqsUrl

// 1. Fetch SQS queue attributes using a GET request
function fetchSqsAttributes($sqsUrl) {
    // Initialize cURL session
    $ch = curl_init();

    // Set the URL and options
    curl_setopt($ch, CURLOPT_URL, $sqsUrl."?Action=GetQueueAttributes&AttributeNames=ApproximateNumberOfMessages"); // Here we are fetching only ApproximateNumberOfMessages, but you can also fetch other  attributes, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html
 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    // Execute cURL request
    $response = curl_exec($ch);

    // Check if there was an error
    if (curl_errno($ch)) {
        echo "Error: " . curl_error($ch);
        return null;
    }

    // Close cURL session
    curl_close($ch);

    return $response;
}

// 2. Parse the XML response to get the queue attributes
function parseSqsAttributes($xmlResponse) {
    $attributes = [];

    // Load the XML response
    $xml = simplexml_load_string($xmlResponse);

    // Set the namespace for AWS SQS
    $namespace = 'http://queue.amazonaws.com/doc/2012-11-05/';

    // Find the GetQueueAttributesResult element
    $getQueueAttributesResult = $xml->children($namespace)->GetQueueAttributesResult;

    // Check if we have attributes
    if (!empty($getQueueAttributesResult)) {
        foreach ($getQueueAttributesResult->Attribute as $attribute) {
            // Extract Name and Value for each attribute
            $name = (string) $attribute->Name;
            $value = (string) $attribute->Value;

            // Add the attribute to the array
            $attributes[$name] = $value;
        }
    }

    return $attributes;
}

// 3. Fetch and parse SQS queue attributes
$xmlResponse = fetchSqsAttributes($sqsUrl);

if ($xmlResponse) {
    // Parse XML response into attributes
    $attributes = parseSqsAttributes($xmlResponse);

    // Display the attributes
    echo "SQS Queue Attributes:\n";
    foreach ($attributes as $name => $value) {
        echo "Attribute Name: " . $name . "\n";
        echo "Attribute Value: " . $value . "\n";
        if ($name == 'ApproximateNumberOfMessages' && $value > 0){
          // start the message fetcher process
        }
    }
} else {
    echo "Failed to fetch SQS attributes.";
}

?>
