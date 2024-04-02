require('dotenv').config();
const puppeteer = require('puppeteer');
const http = require('http');
const crypto = require('crypto')

const PORT = process.env.PORT;
const TARGET_URL = {
	URL1 : process.env.TARGET_URL1,
	URL2 : process.env.TARGET_URL2,
};

const KEYWORD = process.env.KEYWORD;

const cache = {};

const redirectURL = (res, url) => {
	res.writeHead(301,{
			"Location": url,
			"Access-Control-Allow-Origin": "*"
		});
		res.end();
}


(async() => {

  console.log("START PUPPETEER")
	
  let URL = "https://github.com/";
  const browser = await puppeteer.launch({

	args: [
		"--disable-setuid-sandbox",
		"--no-sandbox",
		"--single-process",
		"--no-zygote",
	  ],
	
	headless: 'new',

	executablePath: process.env.NODE_ENV === "production"
	? process.env.PUPPETEER_EXECUTABLE_PATH
	: puppeteer.executablePath()
  });

  const page = await browser.newPage();
  
try {
  
  const customUA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
 
  await page.setUserAgent(customUA);
  
  await page.setViewport({width: 1920, height: 1080});
  
  await page.setRequestInterception(true);
  
  page.on('request', interceptedRequest => {
    if ( interceptedRequest.isInterceptResolutionHandled() ) return;
    if ( interceptedRequest.url().includes("TT") ) {
	   URL = interceptedRequest.url();
	} else {
		interceptedRequest.continue();
	}
  });
  
  await page.goto(tURL);

  
await page.screenshot({
  path: 'full.png',
  fullPage: true
 })
 console.log(await page.title())
		
 } catch (e) {
	console.log(e);
 } finally {
	await browser.close();
 }


})();



server.listen(PORT, () => console.log('Listening on port:', PORT));

