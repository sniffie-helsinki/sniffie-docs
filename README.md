# Sniffie technical documentation

This repository contains API descriptions and instructions on how to integrate to our Sniffie backend, to push products and orders data, and how to get price suggestions and/or other data out. 

## Capabilities
We offer multiple ways to integrate into our system, depending on the use case and the clients' capabilities.
Our go to solutions, which you can do implement mostly yourself by following the instructions and documentation, are:

For bringing data into Sniffie:
1. Bulk transfer (preferred)
2. Rest API

For fetching data from Sniffie:
1. Dedicated SQS queues (preferred)
3. Bulk download
2. Rest API

But if these do not work, we do offer Custom solutions, where we integrate into your system, for which we then charge an integration fee depending on how complex the job is. 

### Bulk transfer
For SniffieV1Enterprise, see [SniffieV1Enterprise/bulkTransfer](SniffieV1Enterprise/bulkTransfer)

### Rest API
For SniffieV1Enterprise, see [SniffieV1Enterprise/rest](SniffieV1Enterprise/rest)
For SniffieNext see [SniffieNext/headless](SniffieNext/headless)
