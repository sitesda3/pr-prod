require('dotenv').config();
const puppeteer = require('puppeteer');
const http = require('http');


const PORT = process.env.PORT;
const TARGET_URL = {
	URL1 : process.env.TARGET_URL1,
	URL2 : process.env.TARGET_URL2,
};

const KEYWORD = process.env.KEYWORD;

const getURL = async (req, res, tURL) => {

  console.log(tURL)
	
  let URL = "";
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
    if ( interceptedRequest.url().includes(KEYWORD) ) {
	   URL = interceptedRequest.url();
	} else {
		interceptedRequest.continue();
	}
  });
  
  await page.goto(tURL);
  
  await page.waitForSelector('video').then(() => {
		res.writeHead(301,{
			"Location": URL,
			"Access-Control-Allow-Origin": "*"
		});
		res.end();
	});
		
  await browser.close();
  
 } catch (e) {
	console.log(e);
 } finally {
	await browser.close();
 }
};

const server = http.createServer((req, res) => {
  
  switch (req.url) {
	  
	  case '/c115273b8b483e5375924ba490691e5a' : //mtv
			getURL(req, res, TARGET_URL.URL1);
			break;
	  
	  case '/muztv' : 
			getURL(req, res, TARGET_URL.URL1);
			break;
			
	  case '/ed2c352e963ac76ec419bfced145e298' : //stv
			getURL(req, res, TARGET_URL.URL2);
			break;
			
	  case '/stv' : 
			getURL(req, res, TARGET_URL.URL2);
			break;
			
	  default:
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.write('Not found');
			res.end();  
  }

});

server.listen(PORT);

