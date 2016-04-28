# DCUCloudTechologyAssignment3
Assignment source code for cloud technology coursework at Dublin City University. This focuses on understanding big data technologies like apache hadoop.

##Motivation and introduction
The primary requirements are to use a cloud data processing technology for _ETL(Extract, Transform and Load)_ Big Data and create either a Web or Mobile UI with it; this coursework is using Apache Hadoop and D3.js for these purposes. Essentially, AWS is a cloud service providing suite of services like **storage with S3, map-reduce processing with EMR, querying with Hive on top of Apache Hadoop**.

**D3.js** is ideal as a webfrontend as it runs on Node.js server to visualise big data.

##Data
Big data is present abundant in open source community. Almost all forms require cleaning, processing and querying.
###Source 
The data from [Lending Club](https://www.lendingclub.com/info/download-data.action) is used. It represents data regarding loans issued in various US states such as _amount, status, interest rate_ etc. These parameters can help investors in determining which borrowers to support.
###Selection
The data can only be downloaded in csv format. It has been divided into 4 categories based on date range. **The goal of this application is to showcase the total number of loans issued by each state for the given time frame.** This will help provide an insight into which states have the highest loans amount to be paid and provide another factor to the investors to consider.
###Preparation
Eventhough Apache hadoop instance can be set up locally, using AWS is the easier alternative, though not the cheaper one. After downloading the data, the cleaning is done by running a java jar. Cleaning the output to match the topojson format can be achieved through easily available regex tools since it only requires changing tab to comma, and swapping values.
###Cleaning
For preparing the data, the [DataTransformer](https://github.com/abha9393/DCUCloudTechologyAssignment3/blob/master/src/main/java/DataTransformer.java) tool has been used to extract requisite columns and merge the four separate csv files into one for upload into AWS S3. Of the 115 attributes, 4 are useful: _address-state, amount, id and member-id_.

##Implementation – processing, querying, storing
**AWS EMR cluster** has been created with a **hive** script
![Alt text](https://github.com/abha9393/DCUCloudTechologyAssignment3/blob/master/src/main/resources/Cluster.PNG)
This script invokes HiveQL to get the requisite output which is stored in the output folder in AWS S3. It creates a loan table in Hive Datawarehouse on top of Hadoop and allows relational sql to be run on it such as grouping on all states to the sum total of all the amounts of loan. The [output](https://s3-eu-west-1.amazonaws.com/lending-data-15210445/output/query1/) is stored in tsv format. This also requires further processing to be used for the UI.

##Related Work – any similar systems
 The UI output is shown using a choropleth map of US states. This is based on https://github.com/yaph/d3-geomap, which is a very commonly used library to create geomaps.
