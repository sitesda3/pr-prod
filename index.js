require('dotenv').config();
const puppeteer = require('puppeteer');
const http = require('http');

const PORT = process.env.PORT;



const server = http.createServer(function (req, res) {


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
const PAGETITLE = await page.title();
 console.log(PAGETITLE)
		
 } catch (e) {
	console.log(e);
 } finally {
	await browser.close();
 }

  res.write('Hello World!:',PAGETITLE); //write a response to the client
  res.end(); //end the response
	
})();


})

server.listen(PORT, () => console.log('Listening on port:', PORT));

