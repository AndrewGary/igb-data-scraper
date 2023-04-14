const fs = require("fs");
const { promisify } = require("util");
const mariadb = require("mariadb");
require("dotenv").config();

const { createConnection } = require("./getDBConnection");

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

const processAndUploadToDB = async () => {
	const connection = await createConnection();

	const resp = await connection.query("select * from all_data limit 10");

	console.log(resp);
	// console.log(connection);

	await connection.end();
};

processAndUploadToDB();
