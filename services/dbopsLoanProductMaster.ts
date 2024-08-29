/*
@author         :   karthick.d
@since          :   07/08/2024
@description    :   returns db utility methods for CRUD operations of Masters table
insert , update , select , delete ops of Masters table
*/
import { getColumns, prepareDB } from "./dbservices";
import { DBSchemaConstants } from "@/constants";
import { LoanProductColumns } from "@/apptypes";

/* 
@usage      : insert branch master data ,
@args       : db - dbinstance , data is a object to save in table
*/
const table = DBSchemaConstants.LOAN_PRODUCT_MASTER;
export const save = async (
  data: Record<string, string | number | null>,
  subcode: string
) => {
  const db = await prepareDB();
  const subCode = subcode;
  const columns = getColumns(LoanProductColumns);
  console.log(columns);
  try {
    const query = `INSERT INTO ${table} (${columns})
    VALUES ("${subCode}", "${data.lpdPrdType}", "${data.lpdProdId}", "${data.lpdHlType}", "${data.lpdPrdDesc}")`;
    console.log(query);
    await db.execAsync(query);
    console.info(`inser table ${table} success`);
  } catch (error) {
    console.error(`inser table ${table} error : ${error}`);
  }
};

// find and return all rows from table
export const findAll = async () => {
  const db = await prepareDB();
  const allRows = await db.getAllAsync(`SELECT * FROM ${table}`);

  return allRows;
};

export const findBySubCodeID = async (id: string) => {
  const db = await prepareDB();
  console.log("findBySubCodeID", id);
  const allRows = await db.getAllAsync(
    `SELECT * FROM ${table} WHERE subCode=${id}`
  );
  return allRows;
};

export const findByProdID = async (id: string) => {
  const db = await prepareDB();
  const allRows = await db.getAllAsync(
    `SELECT * FROM ${table} WHERE lpdProdId=${id}`
  );
  return allRows;
};

export const deleteAll = async () => {
  const db = await prepareDB();
  await db.execAsync(`DELETE FROM ${table}`); // Binding named parameters from object
};
