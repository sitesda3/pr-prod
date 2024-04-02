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




const getURL = async (req, res, tURL, route) => {
	
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
  
  cache[route] = {
	  url: URL,
	  timestamp: Date.now()
  }
  
  await page.waitForSelector('video').then(() => {
		redirectURL(res, URL);
	});
		
 } catch (e) {
	console.log(e);
 } finally {
	await browser.close();
 }
};

const routeReq = (req, res, targetURL, route) => {
	if (cache?.[route]?.url && (Date.now() - cache?.[route]?.timestamp) < 1000 * 60 * 60) {
				console.log('From cache');
				redirectURL(res, cache?.[route]?.url);
			} else {
				console.log('From source');
				getURL(req, res, targetURL, route);
			}
}

const server = http.createServer((req, res) => {
	
	const route = req.url === '/' ? '/' : req.url.split('/')[1].split('.')[0];
	
    switch (route) {

	  case '/' :
			res.writeHead(200, { 'Content-Type': 'text/html' });
			res.write('IP denied');
			res.end();
			break; 
	  
	  case 'c115273b8b483e5375924ba490691e5a' : //m
			
			routeReq(req, res, TARGET_URL.URL1, route);
					
			break;
	  
	  case 'ed2c352e963ac76ec419bfced145e298' : //s
			
			routeReq(req, res, TARGET_URL.URL2, route);
			
			break;
			
	   case 'b439a4514c277ce6fccc8f28ca817183' : //c
			
			const date = new Date();
			const token = date.getUTCDate() + date.getUTCMinutes();
			const hash = crypto.createHash('sha1').update(token.toString()).digest('hex');
			
			const origins = ['https://pl-site.onrender.com', 'https://watch.onlinetv.dnsabr.com'];
			let origin = ''
			if (origins.includes(req.headers.origin)) {
				origin = req.headers.origin;
			}
			console.log(req.headers.origin);
	        res.writeHead(200, 
			  { 'Content-Type': 'text/html', 
				'Access-Control-Allow-Headers': 'Content-Type, X-Route', 
				'Access-Control-Expose-Headers': 'Content-Type, X-Route', 
			    'Access-Control-Allow-Origin': `${origin}`, 
				'Vary': 'Origin',
				'X-Route': hash
			  });
			
			res.end()
			
			break;
			
			
	  default:
			res.writeHead(404, { 'Content-Type': 'text/html' });
			res.write('Not found');
			res.end();  
  }

});

server.listen(PORT, () => console.log('Listening on port:', PORT));

