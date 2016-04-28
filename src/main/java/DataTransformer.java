import au.com.bytecode.opencsv.CSVReader;
import au.com.bytecode.opencsv.CSVWriter;
import org.apache.commons.lang3.StringUtils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

/**
 * This class merges and transforms csv input data from the stack exchange so that it can be easily parsed in the
 * AWS EMR Hadoop Hive system.
 * <p>
 * The schema is posts {PostId INT, OwnerId INT, Score INT, Body String}.
 * <p>
 * Workflow of the program:
 * 1.Merges the five files to one.
 * 2.Removes linefeeds so that each row represents one row of csv data.
 * 3.Removes quotation marks from all data as according to the csv format,
 * the integer fields do not need it. In this case, the first three fields are
 * integer and fourth one is string.
 * 4.Thus, also adds the quotation back to the last field (which is a String field).
 * 5.Escapes any commas in the last string field with quotation marks.
 */
public class DataTransformer {

    public static final int NUM_OF_FILES = 4;

    /**
     * Merges and Transforms the input files to one output file. The merged file can also be accessed.
     *
     * @param args [0]: the output file path eg. path\to\outputFile.
     *             [1]: the merged file path eg. path\to\mergedFile.csv.
     *             [2]: the pattern for the input file path eg. if files are path\to\input1.csv, path\to\input1.csv
     *             then this argument value should be path\to\input. The pattern is based on increment starting from 1.
     */
    public static void main(String[] args) {
        String outputFilePath = "C:\\Workspace\\CloudTechnology\\src\\main\\resources\\LendingF1.csv";
        String mergedFilePath = "C:\\Workspace\\CloudTechnology\\src\\main\\resources\\loansM1.csv";

        File[] files = new File[NUM_OF_FILES];
        for (int i = 1; i <= NUM_OF_FILES; i++) {
            files[i - 1] = new File("C:\\Workspace\\CloudTechnology\\src\\main\\resources\\old_data\\loans" + i + ".csv");
        }
        File mergedFile = new File(mergedFilePath);

              mergeFiles(files, mergedFile);
        removeQuotes(mergedFilePath, outputFilePath);
        writeFirst10Lines(outputFilePath, "C:\\Workspace\\CloudTechnology\\src\\main\\resources\\loans10.csv");
    }

    public static void writeFirst10Lines(String inputFile, String outputFile) {
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(outputFile));
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            BufferedReader reader = new BufferedReader(new FileReader(inputFile));
            for (int i = 0; i < 10; i++) {
                writer.write(reader.readLine());
                writer.newLine();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void removeQuotes(String inputFile, String outputFile) {
        BufferedWriter writer = null;
        try {
            writer = new BufferedWriter(new FileWriter(outputFile));
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            BufferedReader reader = new BufferedReader(new FileReader(inputFile));
            String aLine;
            while ((aLine = reader.readLine()) != null) {
                //remove quotes.
                aLine = aLine.replaceAll("\"", "");
                String cells[] = aLine.split(",");
                String row = "";

                for (String cell : cells) {
                    if (isInteger(cell)) {
                        row += Integer.parseInt(cell) + ",";
                    } else if (isDouble(cell)) {
                        row += Double.parseDouble(cell) + ",";
                    } else {
                        row += "\"" + StringUtils.strip(cell) + "\",";
                    }
                }
                if (row.length() > 0) {
                    row = row.substring(0, row.length() - 1);
                }
                writer.write(row);
                writer.newLine();
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        try {
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static void mergeFiles(File[] files, File mergedFile) {
        CSVWriter writer = null;
        try {
            writer = new CSVWriter(new FileWriter(mergedFile));
        } catch (IOException e) {
            e.printStackTrace();
        }

        CSVReader reader;
        for (File f : files) {
            System.out.println("merging: " + f.getName());
            try {
                reader = new CSVReader(new FileReader(f));
                String[] aLine;
                while ((aLine = reader.readNext()) != null) {
                    for (int i = 0; i < aLine.length; i++) {
                        //remove extra line feeds within a csv row.
                        aLine[i] = "\"" + aLine[i] + "\"";
                    }
                    writer.writeNext(aLine);
                }

                reader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        try {
            writer.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static boolean isInteger(String s) {
        try {
            Integer.parseInt(s);
        } catch (NumberFormatException e) {
            return false;
        } catch (NullPointerException e) {
            return false;
        }
        // only got here if we didn't return false
        return true;
    }

    public static boolean isDouble(String s) {
        try {
            Double.parseDouble(s);
        } catch (NumberFormatException e) {
            return false;
        } catch (NullPointerException e) {
            return false;
        }
        // only got here if we didn't return false
        return true;
    }
}