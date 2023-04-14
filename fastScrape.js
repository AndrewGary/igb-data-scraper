//This script will be pointed to a directory with all the csvs and upload them to the database
const fs = require("fs");
const { promisify } = require("util");
const mariadb = require("mariadb");
require('dotenv').config();

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

const uploadDataToDB = async () => {
  const directoryPath = "./dataFiles/";
  const files = await readdir(directoryPath);
  const uploadData = [];

  //Grab the headers from the table columns
  const headerNames = await getTableNames("all_data");

  //Pop the last value from the headerNames array because it is a autoIncrement column/primary key
  headerNames.pop();

  //This for loop is looping through all the files in the dataFiles folder
  for (let i = 0; i < files.length; i++) {
    // for (let i = 0; i < 1; i++) {
    const filePath = directoryPath + files[i];
    const data = await readFile(filePath, "utf-8");

    const rows = data
      .trim()
      .split("\n")
      .map((row) => {
        const regex = /("[^"]*")|([^,"]+)/g;
        const matches = row.match(regex);
        return matches.map((match) => {
          return match.replace(/"/g, "");
        });
      });

      for(let index = 4; index < rows.length; index++){
        const dataRow = [];

        dataRow.push(rows[1][0])


        for (let ii = 0; ii < rows[index].length; ii++) {
            if (ii === 3) {
              // console.log(parseInt(rows[4][i].replaceAll('"', '')))
              dataRow.push(parseInt(rows[index][ii].replaceAll('"', "")));
            } else if (ii > 3) {
              // console.log(rows[4][i])
              dataRow.push(parseFloat(rows[index][ii].replaceAll('"', "")));
            } else {
              dataRow.push(rows[index][ii].replaceAll('"', ""));
            }
          }

          dataRow.pop();
          uploadData.push(dataRow);
      }
  }

  const idk = [];
  for(let i = 0; i < uploadData.length; i++){
    if(uploadData[i].includes('') || uploadData[i].length !== 14){
        
    }else{
        idk.push(uploadData[i]);
    }
  }

  let iii = 0;
  for(let i = 0; i < idk.length; i++){
    if(idk[i].length !== 14){
        console.log(`idk index ${i}`)
        console.log(idk[i])
        iii++;
    }
  }
  console.log(`iii: ${iii}`)
//   console.log(uploadData);

  const headerNamesString = headerNames.join(", ");

//   console.log(headerNamesString);

//   let conn;
//   try {
//     conn = await pool.getConnection();

//     //There is an error because the dataTypes are not correct
//     let count = 0;
//     for (const row of uploadData) {

//         try{
//       const result = await conn.query(
//         `INSERT IGNORE INTO all_data (${headerNamesString}) VALUES (?)`,
//         [row]
//       );
//       console.log(`Inserted ${result.affectedRows} row(s): count: ${count}`);
//       count++;
//         }catch(error){
//             console.log(error);
//             continue;
//         }
//     }
//   } catch (err) {
//     console.error(err);
//   } finally {
//     if (conn) conn.release();
//   }
}

const getTableNames = async (tableName) => {
    const connection = await pool.getConnection();
  
    const getTableColumnsQuery = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = '${tableName}'
  `;
  
    const columnNamesArray = await connection.query(getTableColumnsQuery);
    const arrayOfNames = columnNamesArray.map((obj) => {
      return obj.column_name;
    });
  
    //   console.log(arrayOfNames);
  
    return arrayOfNames;
  };

uploadDataToDB();