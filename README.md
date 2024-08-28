# Sniffie technical documentation

This repository contains API descriptions and instructions on how to integrate to our Sniffie backend, to push products and orders data, and how to get price suggestions and/or other data out. 

## Capabilities
We offer multiple ways to integrate into our system, depending on the use case and the clien't capabilities.
Our go to solutions, which you can do by yourself by following the instructions and documentation, are:

For bringing data into Sniffie:
1. Bulk transfer (preferred)
2. Rest API
3. Custom solution

For fetching data from Sniffie:
1. Dedicated SQS queues (preferred)
2. Rest API
3. Custom solution

### Bulk transfer
For SniffieV1Enterprise, see [SniffieV1Enterprise/bulkTransfer](SniffieV1Enterprise/bulkTransfer)

### Rest API
For SniffieV1Enterprise, see [SniffieV1Enterprise/rest](SniffieV1Enterprise/rest)
For SniffieNext see [SniffieNext/headless](SniffieNext/headless)
