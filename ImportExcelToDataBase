using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Spreadsheet;
using System;
using System.Data;
using System.Data.OleDb;
using System.Data.SqlClient;
using System.Linq;
using Utils;

namespace Import
{
    class ImportExcelToDataBase
    {
        private static string[] onlyCols = { "R", "V","W", "Z", "AC", "AF", "AI", "AJ", "BJ" };
        private static string[] mappings = { "OORIndicator", "SupplierCode", "Almacen", "DOCIdentifier", "Pieza", "UnitMeasure", "MFGPartNumber",  "ShortDescription", "StdPrice" };
        private static Type[] colsDataTypes = { typeof(string), typeof(string), typeof(string), typeof(string), typeof(string), typeof(string), typeof(string), typeof(string), typeof(float) };

        private static DataTable dt;

        /*static void Main(string[] args)
        {

            MakeDataTable();

            //string fileName = @"C:\temp\LecturaAlbaranes\test.xlsx";
            string fileName = @"C:\temp\LecturaAlbaranes\strat.xlsx";
            FileToDatabase(fileName);
            //readExcel(fileName);
        }*/
        //

        private static void MakeDataTable()
        {
            dt = new DataTable();
            dt.Clear();
            for (int index = 0; index < onlyCols.Length; index++)
            {
                dt.Columns.Add(onlyCols[index]);
                dt.Columns[index].DataType = colsDataTypes[index];
            }
        }



        // The SAX approach.
        public static bool FileToDatabase(string fileName, string sqlTblGPE)
        {


            MakeDataTable();
            try
            {
                using (SpreadsheetDocument spreadsheetDocument = SpreadsheetDocument.Open(fileName, false))
                {
                    WorkbookPart workbookPart = spreadsheetDocument.WorkbookPart;
                    WorksheetPart worksheetPart = workbookPart.WorksheetParts.First();

                    OpenXmlReader reader = OpenXmlReader.Create(worksheetPart);

                    string rowNum;

                    while (reader.Read())
                    {
                        //skip three rows
                        if (reader.ElementType == typeof(Row))
                        {
                            reader.ReadFirstChild();

                            if (reader.HasAttributes)
                            {
                                rowNum = reader.Attributes.First(a => a.LocalName == "r").Value;
                                //Avoid the first three columns, and another that has headers
                                if ("A1-A2-A3-A4".LastIndexOf(rowNum) != -1)
                                {
                                    do { } while (reader.ReadNextSibling()); //read at the end of the row

                                    continue;//read next from the main while
                                }

                            }

                            //Load in datatable, preparing datarow
                            DataRow row = dt.NewRow();
                            do
                            {

                                if (reader.ElementType == typeof(Cell))
                                {
                                    Cell c = (Cell)reader.LoadCurrentElement();

                                    //Only cols [R,V,Z,AC,AF,AJ,BJ], avoid any other columns
                                    var check = onlyCols.Any(colStart => c.CellReference.Value.StartsWith(colStart));
                                    if (check)
                                    {

                                        string cellValue;

                                        if (c.DataType != null && c.DataType == CellValues.SharedString)
                                        {
                                            SharedStringItem ssi = workbookPart.SharedStringTablePart.SharedStringTable.Elements<SharedStringItem>().ElementAt(int.Parse(c.CellValue.InnerText));

                                            cellValue = ssi.Text.Text;
                                        }
                                        else
                                        {
                                            cellValue = c.CellValue == null ? null : c.CellValue.InnerText;
                                        }


                                        //Console.Out.Write("{0}: {1} ", c.CellReference, cellValue);


                                        row[ExcelColNameFromReferenc(c.CellReference)] = cellValue;



                                    }
                                }
                            } while (reader.ReadNextSibling());
                            //Add datarow to datatable
                            dt.Rows.Add(row);

                            //Console.Out.WriteLine();
                        }

                    }
                    DataTableToServer(dt, sqlTblGPE);

                    return true;
                }
            }
            catch (Exception ex)
            {

                return false;
            }
        }
        private static string ExcelColNameFromReferenc(string cellReference)
        {
            return onlyCols.Where(colname => cellReference.StartsWith(colname)).FirstOrDefault();

        }
        //
        private static void DataTableToServer(DataTable dt, string sqlTblGPE)
        {


            try
            {
                using (SqlBulkCopy bulkCopy = new SqlBulkCopy(U.getSqlConnnection(Program.connstr_servidorSQL_NPM)))
                {
                    for (int index = 0; index < mappings.Length; index++)
                    {
                        bulkCopy.ColumnMappings.Add(onlyCols[index], mappings[index]);
                    }

                    bulkCopy.DestinationTableName = sqlTblGPE;
                    bulkCopy.WriteToServer(dt);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }


        }

    }
}
