<?php
require 'vendor/autoload.php';

use Aws\Sqs\SqsClient;
use GuzzleHttp\Client;

$queue = ''; // queue url: string, get this from Sniffie
$env = ''; // environment: string, '' or 'staging'
$accountId = null; // accountId: number, get this from Sniffie
$apiKey = ''; // apiKey: string, get this from Sniffie

$config = [
    'method' => 'GET',
    'url' => 'https://api' . ($env === 'staging' ? '-staging' : '') . '.sniffie.io/v1/account-products/' . $accountId . '/get-queue-credentials?queue=' . $queue,
    'headers' => [
        'Authorization' => $apiKey,
    ],
];

function getTempCredentials($config) {
    $client = new Client();
    try {
        $response = $client->request($config['method'], $config['url'], [
            'headers' => $config['headers']
        ]);
        $data = json_decode($response->getBody(), true);
        return $data['data']['stsCredentials'];
    } catch (Exception $e) {
        echo $e->getMessage();
    }
}

function pollSqsQueue($url, $credentials) {
    $sqs = new SqsClient([
        'version' => 'latest',
        'region'  => 'eu-north-1',
        'credentials' => [
            'key'    => $credentials['AccessKeyId'],
            'secret' => $credentials['SecretAccessKey'],
            'token'  => $credentials['SessionToken'],
        ],
    ]);

    $params = [
        'QueueUrl' => $url,
        'MaxNumberOfMessages' => 10,
        'VisibilityTimeout' => 30,
        'WaitTimeSeconds' => 20,
    ];

    try {
        $result = $sqs->receiveMessage($params);
        print_r($result);
        return $result;
    } catch (AwsException $e) {
        echo $e->getMessage();
    }
}
function processMessage($message) {
    // Do whatever processing you need
    echo $message['Body'] . "\n";
    return true;
}

$credentials = getTempCredentials($config);
if ($credentials) {
    $messages = pollSqsQueue($queue, $credentials['Credentials']);
    if ($messages && isset($messages['Messages'])) {
        $deleteParams = [
            'QueueUrl' => $queue,
            'Entries' => []
        ];

        foreach ($messages['Messages'] as $message) {
            processMessage($message);
            // delete message after successful processing
            // Add message to delete batch
            $deleteParams['Entries'][] = [
                'Id' => $message['MessageId'],
                'ReceiptHandle' => $message['ReceiptHandle']
            ];
        }

        // Delete messages in batch
        try {
            $sqs = new SqsClient([
                'version' => 'latest',
                'region'  => 'eu-north-1',
                'credentials' => [
                    'key'    => $credentials['Credentials']['AccessKeyId'],
                    'secret' => $credentials['Credentials']['SecretAccessKey'],
                    'token'  => $credentials['Credentials']['SessionToken'],
                ],
            ]);
            $result = $sqs->deleteMessageBatch($deleteParams);
            print_r($result);
        } catch (AwsException $e) {
            echo $e->getMessage();
        }
    }
}
?>