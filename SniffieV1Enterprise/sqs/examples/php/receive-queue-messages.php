<?php
// Include the config file that contains the SQS URL
include 'config.php';

// Fetch messages from the SQS queue
function fetchMessages($sqsUrl) {
    // Initialize cURL session
    $ch = curl_init();

    // Set the URL and options
    curl_setopt($ch, CURLOPT_URL, $sqsUrl . '?Action=ReceiveMessage&MaxNumberOfMessages=10'); // Add parameters for receiving messages
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

// Parse the XML response to get the messages and convert them to JSON
function parseMessagesToJson($xmlResponse) {
    $messages = [];

    // Load the XML response
    $xml = simplexml_load_string($xmlResponse);

    // Set the namespace for AWS SQS
    $namespace = 'http://queue.amazonaws.com/doc/2012-11-05/';

    // Find the messages within the XML
    $messagesXml = $xml->children($namespace)->ReceiveMessageResult;

    if (!empty($messagesXml)) {
        foreach ($messagesXml->Message as $message) {
            $messageId = (string) $message->MessageId;
            $receiptHandle = (string) $message->ReceiptHandle;
            $body = (string) $message->Body;

            // Create a JSON object for each message
            $messages[] = [
                'MessageId' => $messageId,
                'ReceiptHandle' => $receiptHandle,
                'Body' => $body
            ];
        }
    }

    return $messages;
}

// Send a POST request to delete the fetched messages
function deleteMessages($sqsUrl, $messages) {
    $entries = [];
    foreach ($messages as $message) {
        $tmp = [
            'ReceiptHandle' => $message['ReceiptHandle'],
            'Id' => $message['MessageId']
        ];
        // Prepare the payload for the DeleteMessage action
        array_push($entries, $tmp);
    }
    $payload = json_encode(["QueueUrl" => $sqsUrl, "Entries" => $entries]);

    // Prepare cURL for sending POST request
    $ch = curl_init();

    // Set ISO 8601 date format
    $isoDate = gmdate("Ymd\THis\Z");

    // Set the URL and options for the POST request
    curl_setopt($ch, CURLOPT_URL, $sqsUrl);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/x-amz-json-1.0',
        'X-Amz-Target: AmazonSQS.DeleteMessageBatch',
        'X-Amz-Date: ' . $isoDate,
        'Connection: Keep-Alive'
    ]);

    // Execute the cURL request
    $response = curl_exec($ch);
    // Check if there was an error
    if (curl_errno($ch)) {
        echo "Error: " . curl_error($ch);
    } else {
        $obj = json_decode($response, true);
        if (array_key_exists('Failed', $obj)) {
          echo "Some failed\n";
        } else {
          echo "Successfully deleted messages\n";
        }
    }

    // Close cURL session
    curl_close($ch);
}

$continue = true;
while ($continue){
  $xmlResponse = fetchMessages($sqsUrl);

  if ($xmlResponse) {
      // Parse the messages from the XML response
      $messages = parseMessagesToJson($xmlResponse);

      // Display fetched messages
      if (empty($messages)){ // break the loop
        $continue = false;
      }
      // Send POST requests to delete the messages
      if (!empty($messages)) {

          // ADD HERE YOUR LOGIC TO HANDLE MESSAGE SAVING PRIOR DELETION

          deleteMessages($sqsUrl, $messages);
      } else {
          echo "No messages to delete.\n";
      }
  } else {
      $continue = false;
      echo "Failed to fetch messages.\n";
  }

}
?>
