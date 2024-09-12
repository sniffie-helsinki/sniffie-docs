package pollQueueMessages;

import java.io.IOException;
import java.io.StringReader;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.json.JsonReader;
import javax.json.JsonStructure;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

class ReceiveSqsMessages {

    public static void main(String[] args) {
        try {
            // 1. Read the SQS URL from the config.txt file using Files.readString()
            String filePath = "config.txt";
            String sqsUrl = Files.readString(Paths.get(filePath)).trim(); // Trim any whitespace or newlines

            String NUMBER_OF_MSG = "10"; // define how many messages you want, defaults to 10

            String finalUrl = sqsUrl+"?Action=Action=ReceiveMessage&MaxNumberOfMessages="+NUMBER_OF_MSG;
            System.out.println("Fetching queue attributes from: " + finalUrl);

            // 2. Make a GET request to fetch messages from the SQS endpoint
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest getRequest = HttpRequest.newBuilder()
                    .uri(URI.create(sqsUrl))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(getRequest, HttpResponse.BodyHandlers.ofString());

            // Print the response from SQS (it should be XML)
            String xmlResponse = response.body();
            System.out.println("Received XML Response: " + xmlResponse);

            // 3. Parse the XML response to extract messages and convert them into JSON objects.
            List<JsonObject> messageJsonList = parseXmlToJson(xmlResponse);

            // ADD YOUR OWN LOGIC TO STORE & PROCESS MESSAGES

            // 4. Send a POST request to delete the fetched messages
            for (JsonObject messageJson : messageJsonList) {
                sendPostRequest(sqsUrl, messageJson);
            }
        } catch (IOException e) {
            System.err.println("Error reading the SQS URL from the file.");
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // Function to parse the received XML into JSON
    private static List<JsonObject> parseXmlToJson(String xmlResponse) throws Exception {
        List<JsonObject> jsonObjects = new ArrayList<>();
        
        DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
        factory.setNamespaceAware(true); // set this to be name space aware        
        DocumentBuilder builder = factory.newDocumentBuilder();
        Document document = builder.parse(new java.io.ByteArrayInputStream(xmlResponse.getBytes()));

        // Find the messages within the XML
        NodeList messageNodes = document.getElementsByTagNameNS("http://queue.amazonaws.com/doc/2012-11-05/", "Message");

        for (int i = 0; i < messageNodes.getLength(); i++) {
            Element messageElement = (Element) messageNodes.item(i);
            String messageId = messageElement.getElementsByTagName("MessageId").item(0).getTextContent();
            String receiptHandle = messageElement.getElementsByTagName("ReceiptHandle").item(0).getTextContent();
            String body = messageElement.getElementsByTagName("Body").item(0).getTextContent();

            // Create a JSON object for each message
            JsonObjectBuilder jsonObjectBuilder = Json.createObjectBuilder()
                .add("MessageId", messageId)
                .add("ReceiptHandle", receiptHandle)
                .add("Body", body);

            jsonObjects.add(jsonObjectBuilder.build());
        }

        return jsonObjects;
    }

    // Function to send POST request with JSON payload
    private static void sendPostRequest(String sqsUrl, JsonObject jsonPayload) {
        try {
            // Generate ISO 8601 timestamp
            String isoDate = DateTimeFormatter.ISO_INSTANT.format(Instant.now());

            // Create POST request with headers
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest postRequest = HttpRequest.newBuilder()
                    .uri(URI.create(sqsUrl))
                    .header("Content-Type", "application/x-amz-json-1.0")
                    .header("X-Amz-Target", "AmazonSQS.DeleteMessageBatch")
                    .header("X-Amz-Date", isoDate)
                    .header("Connection", "Keep-Alive")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload.toString()))
                    .build();

            // Send the POST request
            HttpResponse<String> response = client.send(postRequest, HttpResponse.BodyHandlers.ofString());

            // Print the response of the POST request
            System.out.println("POST Response: " + response.body());
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
