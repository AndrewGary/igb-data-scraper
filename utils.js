const mariadb = require("mariadb");
const fs = require("fs");
const { promisify } = require("util");
require("dotenv").config();

const createConnection = async () => {
	const connection = await mariadb.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});

	return connection;
};

/**
 * This function takes in a filepath to a .csv file and returns the rows
 * It also removes the last value in each row if the value is '\r'
 */

const readCSVFile = async (filePath) => {
	const readFile = promisify(fs.readFile);

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

	// for (let i = 0; i < rows.length; i++) {
	// 	if ((rows[i][rows[i].length - 1] = "\r")) {
	// 		rows[i].pop();
	// 	}
	// }

	return rows;
};

//This function takes in a tableName from the db, and returns all the column headers in an array;
const getTableNames = async (tableName) => {
	const connection = await createConnection();

	const getTableColumnsQuery = `
	SELECT column_name
	FROM information_schema.columns
	WHERE table_name = '${tableName}'
  `;

	const columnNamesArray = await connection.query(getTableColumnsQuery);

	// console.log(columnNamesArray);
	const arrayOfNames = columnNamesArray.map((obj) => {
		return obj.column_name;
	});

	//   console.log(arrayOfNames);

	return arrayOfNames;
};

const writeArrayToFile = (arr, filename) => {
	// Convert the array to a JSON string
	const json = JSON.stringify(arr, null, 2);
  
	// Write the JSON string to the file
	return new Promise((resolve, reject) => {
	  fs.writeFile(filename, json, (err) => {
		if (err) {
		  reject(err);
		} else {
		  resolve();
		}
	  });
	});
  };

module.exports = { createConnection, readCSVFile, getTableNames, writeArrayToFile };
