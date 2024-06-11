import puppeteer from 'puppeteer';
import path from 'path';

(
  async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto('https://books.toscrape.com/');

  // set file path 
  const filePath = path.join('public','images','screenshot.png')
  await page.screenshot({path: filePath})

  // Set screen size
  await page.setViewport({width: 1080, height: 1024});

  await browser.close();
})();