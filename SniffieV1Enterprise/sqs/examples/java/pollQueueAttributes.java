package sqsReader;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;


public class pollQueueAttributes {

  public static void main(String[] args) {
        try {
            // 1. Read the SQS URL from the config.txt file using Files.readString()      
            String filePath = "config.txt";
            String sqsUrl = Files.readString(Paths.get(filePath)).trim(); // Trim any whitespace or newlines            
            /*
              Add the GetAttributes action at the end of the URL.

        Here we are fetching only ApproximateNumberOfMessages, but you can also fetch other  attributes, see https://docs.aws.amazon.com/AWSSimpleQueueService/latest/APIReference/API_GetQueueAttributes.html
        
        If you want all attributes, use AttributeNames=All
             */
            String finalUrl = sqsUrl+"?Action=GetQueueAttributes&AttributeNames=ApproximateNumberOfMessages";
            System.out.println("Fetching queue attributes from: " + finalUrl);

            // 2. Make a simple GET request to the SQS end point.
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(finalUrl))
                    .GET()
                    .build();
            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // Print the response from SQS (it should be XML)
            String xmlResponse = response.body();
            System.out.println("Received XML Response: " + xmlResponse);

            // 3. Parse the XML response to find the specified attributes.
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true); // set this to be name space aware
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document document = builder.parse(new java.io.ByteArrayInputStream(xmlResponse.getBytes()));
            
            // 4. Get the GetQueueAttributesResult element
            NodeList resultNodes = document.getElementsByTagNameNS("http://queue.amazonaws.com/doc/2012-11-05/", "GetQueueAttributesResult");

            if (resultNodes.getLength() > 0) {
                Element resultElement = (Element) resultNodes.item(0);
                NodeList attributeNodes = resultElement.getElementsByTagNameNS("http://queue.amazonaws.com/doc/2012-11-05/", "Attribute");

                // Loop through all Attribute elements
                for (int i = 0; i < attributeNodes.getLength(); i++) {
                    Element attributeElement = (Element) attributeNodes.item(i);

                    // Get the Name and Value elements within each Attribute
                    String attributeName = attributeElement.getElementsByTagName("Name").item(0).getTextContent();
                    String attributeValue = attributeElement.getElementsByTagName("Value").item(0).getTextContent();

                    System.out.println("Attribute Name: " + attributeName);
                    System.out.println("Attribute Value: " + attributeValue);
                    if (attributeName == "ApproximateNumberOfMessages") {
                      int intVal = Integer.parseInt(attributeValue);
                      if (intVal > 0){
                        System.out.println("There are "+attributeValue+" messages available, these should be fetched!");
                        
                        // Add your logic to start message fetching
                      }
                    }
                }
            } else {
                System.out.println("No GetQueueAttributesResult element found.");
            }       
    } catch (Exception e) {
            e.printStackTrace();
        }
        System.out.println("Finished!");

  }

}
