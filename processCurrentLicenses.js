const fs = require("fs");
const { promisify } = require("util");
const mariadb = require("mariadb");
require("dotenv").config();
const axios = require("axios");

const {
  createConnection,
  readCSVFile,
  getTableNames,
  writeArrayToFile,
} = require("./utils");

//This function is for testing.
const testFunction = async () => {
  await writeArrayToFile({ first: "hello", second: 5 }, "data.json");
};

//Created this function for filling the fullAddress column in the currentLicenses table in the db
const fillFullAddressColumn = async () => {
  let connection;
  try {
    connection = await createConnection();

    const results = await connection.query(
      'select licenseName, DBA, address, city, state, zip from currentLicenses where licenseType = "Establishment"'
    );

    //419 Elm Street Yorkville, IL 60560
    const filteredResults = results.map((item) => {
      return {
        licenseName: item.licenseName,
        DBA: item.DBA,
        address: `${item.address
          .trim()
          .replaceAll(" ", "+")}+${item.city.trim()},+IL`,
        insertAddress: `${item.address.trim()}, ${item.city.trim()}, IL ${
          item.zip
        }`,
      };
    });

    console.log(filteredResults[0]);

    for (let i = 0; i < filteredResults.length; i++) {
      try {
        await connection.execute(
          "UPDATE currentLicenses SET fullAddress = ? WHERE licenseName = ?",
          [filteredResults[i].insertAddress, filteredResults[i].licenseName]
        );
        console.log(`inserted row ${i}`);
      } catch (error) {
        console.log(error);
        continue;
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await connection.end();
  }
};

//This function is for fetching the longitude and latitude for each address in the
const fetchCoords = async () => {
  // var geocoding_url = `https://maps.googleapis.com/maps/api/geocode/json?address=${filteredResults[100].address}&key=` + process.env.GEO_API_KEY;

  // const resp = await axios.get(geocoding_url);

  // console.log(resp.data.results[0]);
  let connection;

  try {
	connection = await createConnection();

	const resp = await connection.query('select licenseName, fullAddress from currentLicenses where licenseType = "Establishment"');

	console.log(resp)

	await connection.end();
  } catch (error) {}
};

const processAndUploadToDB = async () => {
  const filePath = "./LicensedApplicants.csv";

  const headers = await getTableNames("currentLicenses");

  const headersString = headers.join(", ");

  const rows = await readCSVFile(filePath);

  const connection = await createConnection();

  const errorRows = [];

  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length !== 10) {
      errorRows.push(i);
    }
  }

  const filteredArray = rows.filter(
    (element, index) => !errorRows.includes(index)
  );

  let insertCount = 0;
  for (const row of filteredArray) {
    try {
      const resp = await connection.query(
        `insert into currentLicenses (${headersString}) values (?)`,
        [row]
      );
      console.log(`inserted row: ${insertCount}`);
    } catch (error) {
      console.log(error);
      continue;
    } finally {
      insertCount++;
    }
  }
};

// processAndUploadToDB();
// fillFullAddressColumn();
fetchCoords();
// testFunction();
