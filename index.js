require('dotenv').config();
const puppeteer = require('puppeteer');
const http = require('http');

const PORT = process.env.PORT;


if (process.env.NODE_ENV === 'production') {
  console.log("production")
}else if (process.env.NODE_ENV === 'development') {
  console.log("development")
}


const server = http.createServer(function (req, res) {


(async() => {

  console.log("START PUPPETEER")
	
  let tURL = "https://github.com/";
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
  
  
  await page.goto(tURL, { waitUntil: 'networkidle2' });

  
await page.screenshot({
  path: 'full.png',
  fullPage: true
 })
const PAGETITLE = await page.title();
console.log('1',PAGETITLE) 
		
 } catch (e) {
	console.log('2',e);
 } finally {
	console.log('3');
	await browser.close();
 }

  res.write('Hello World!:',PAGETITLE); //write a response to the client
  res.end(); //end the response
	
})();


})

server.listen(PORT, () => console.log('Listening on port:', PORT));

