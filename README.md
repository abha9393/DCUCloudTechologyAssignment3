# DCUCloudTechologyAssignment3
Assignment source code for cloud technology coursework at Dublin City University. This focuses on understanding big data technologies like apache hadoop.

##Motivation and introduction
The primary requirements are to use a cloud data processing technology for ETL(Extract, Transform and Load) Big Data and create either a Web or Mobile UI with it; this coursework is using Apache Hadoop and D3.js for these purposes. Essentially, AWS is a cloud service providing suite of services like storage with S3, map-reduce processing with EMR, querying with Hive on top of Apache Hadoop.

D3.js is ideal as a webfrontend as it runs on Node.js server to visualise big data.

##Data
Big data is present abundant in open source community. Almost all forms require cleaning, processing and querying.
###Source 
The data from [Lending Club](https://www.lendingclub.com/info/download-data.action) is used. It represents data regarding loans issued in various US states such as amount, status, interest rate etc. These parameters can help investors in determining which borrowers to support.
###Selection
The data can only be downloaded in csv format. It has been divided into 4 categories based on date range. **The goal of this application is to showcase the total number of loans issued by each state for the given time frame.** This will help provide an insight into which states have the highest loans amount to be paid and provide another factor to the investors to consider.
###Preparation
For preparing the data, the DataTransformer.java tool has been used to extract requisite columns and merge the four separate csv files into one for upload into AWS S3. Of the 115 attributes, 4 are useful: addr_state, amount, id and member_id.
###Cleaning
**AWS EMR cluster** has been created with a **hive** script

##Implementation – processing, querying, storing

##Related Work – any similar systems
 
