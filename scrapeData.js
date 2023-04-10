const puppeteer = require("puppeteer");

const years = [
    "2012",
    "2013",
    "2014",
    "2015",
    "2016",
    "2017",
    "2018",
    "2019",
    "2020",
    "2021",
    "2022",
    "2023",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

async function run() {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: ['--disable-cache']
  });

  const page = await browser.newPage();

  //Opens page
  await page.goto("https://www.igb.illinois.gov/videoreports.aspx");

  //Selects the esatablishment option
  await page.click("#ctl00_MainPlaceHolder_TypeEst");
  
    await page.click("#ctl00_MainPlaceHolder_ViewCSV");
  
    for(let i = 0; i < years.length; i++){
      for(let ii = 0; ii < months.length; ii++){
          await page.select('#ctl00_MainPlaceHolder_SearchStartMonth', months[ii]);
  
          await page.select('#ctl00_MainPlaceHolder_SearchStartYear', years[i]);
  
          await page.select('#ctl00_MainPlaceHolder_SearchEndMonth', months[ii]);
  
          await page.select('#ctl00_MainPlaceHolder_SearchEndYear', years[i]);
          await page.click('#ctl00_MainPlaceHolder_ButtonSearch')
  
          await page.waitForNetworkIdle()
      }
  }

  //Rosaties of Yorkville
  
browser.close();
}

run();




