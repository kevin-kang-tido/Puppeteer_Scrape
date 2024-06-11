import puppeteer from 'puppeteer';
import React from 'react'

export default function BaseTable() {
    // URL to scrape
const url = 'https://en.wikipedia.org/wiki/Provinces_of_Cambodia';

// Create a function to scrape all cards
const scrapeAllCards = async () => {
  // Launch a new browser instance with a visible UI
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Go to the URL
    await page.goto(url, { waitUntil: 'load', timeout: 0 });


    const tablesData = await page.evaluate((url) => {

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
          return rows;
        });
      },url);

    console.log(tablesData);


  } catch (error) {
    console.error('Error scraping data:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
};
scrapeAllCards();
    
  return (
    <>
    <table class="table-fixed">
        <thead>
            <tr>
            <th>Song</th>
            <th>Artist</th>
            <th>Year</th>
            </tr>
        </thead>
        <tbody>
            <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
            </tr>
            <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
            </tr>
            <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
            </tr>
        </tbody>
     </table> 
    </>
  )
}

