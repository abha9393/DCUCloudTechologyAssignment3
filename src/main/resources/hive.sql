--Setting Hive Environemnt.
--Splitting the input data into chunks of approx 64Mb to be processed in parallel 
--rather than processing the entire file sequentially.
set hive.input.format=org.apache.hadoop.hive.ql.io.HiveInputFormat;
set mapred.min.split.size=67108864; 
set mapred.max.split.size=536870912;
--Loading the data.
CREATE EXTERNAL TABLE IF NOT EXISTS test (id INT, member_id INT, loan_amnt INT, loan_status STRING, purpose STRING, addr_state STRING, term STRING, int_rate STRING) ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde' STORED AS TEXTFILE LOCATION 's3://lending-data-15210445/input/finaltest/';
CREATE TABLE IF NOT EXISTS test2 AS SELECT CAST(id AS INT) AS Id, CAST(member_id AS INT) AS Member_Id, CAST(loan_amnt AS INT) AS Amount, loan_status AS Status, purpose AS Purpose, addr_state AS Address_State, term AS TERM, int_rate AS RATE FROM lendingloans;

--Querying to get relevant columns
INSERT OVERWRITE DIRECTORY 's3://lending-data-15210445/output/query1/' SELECT sum(loan_amnt), addr_state FROM lendingloans GROUP BY addr_state;
INSERT OVERWRITE DIRECTORY 's3://lending-data-15210445/output/query2/' SELECT distinct Address_State FROM test2;