import puppeteer from 'puppeteer';

export default async function handler(req, res) {
  
  const url = 'https://en.wikipedia.org/wiki/Provinces_of_Cambodia';

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    const tablesData = await page.evaluate(() => {
      const tables = document.querySelectorAll('table');
      return Array.from(tables).map(table => {
        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText);
        const rows = Array.from(table.querySelectorAll('tr')).slice(1).map(row => {
          const cells = Array.from(row.querySelectorAll('td'));
          const rowData = {};
          cells.forEach((cell, i) => {
            rowData[headers[i] || `Cell ${i + 1}`] = cell.innerText;
          });
          return rowData;
        });
        return { headers, rows };
      });
    });

    await browser.close();
    res.status(200).json(tablesData);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Error scraping data' });
  }
}
