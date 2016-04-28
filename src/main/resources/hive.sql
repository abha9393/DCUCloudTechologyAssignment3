--Setting Hive Environemnt.
--Splitting the input data into chunks of approx 64Mb to be processed in parallel 
--rather than processing the entire file sequentially.
set hive.input.format=org.apache.hadoop.hive.ql.io.HiveInputFormat;
set mapred.min.split.size=67108864; 
set mapred.max.split.size=536870912;
--Loading the data.
CREATE EXTERNAL TABLE IF NOT EXISTS lendingdata (id INT, member_id INT, loan_amnt INT, addr_state STRING, term STRING) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde' STORED AS TEXTFILE LOCATION 's3://lending-data-15210445/input/finaltest/';

--Querying to get relevant columns
INSERT OVERWRITE DIRECTORY 's3://lending-data-15210445/output/query1/' SELECT sum(loan_amnt) AS Total_Amount, addr_state AS US_State FROM lendingdata WHERE addr_state IS NOT NULL GROUP BY addr_state;