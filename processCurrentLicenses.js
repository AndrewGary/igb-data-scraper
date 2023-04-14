const fs = require("fs");
const { promisify } = require("util");
const mariadb = require("mariadb");
require("dotenv").config();

const { createConnection, readCSVFile, getTableNames } = require("./utils");

const processAndUploadToDB = async () => {
	const filePath = "./LicensedApplicants.csv";

	const headers = await getTableNames("currentLicenses");

	console.log("headers: ", headers);
	return;

	// //Pull the rows of data from the .csv file specified above
	// const rows = await readCSVFile(filePath);

	// try{
	//     const connection = await createConnection();
	//     let count = 0;
	//     for(const row of rows){
	//         try{
	//             const result = await connection.query()
	//         }
	//     }

	// }
};

processAndUploadToDB();
