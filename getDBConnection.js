const mariadb = require("mariadb");

const createConnection = async () => {
	const connection = await mariadb.createConnection({
		host: process.env.DB_HOST,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});

	return connection;
};

module.exports = { createConnection };
