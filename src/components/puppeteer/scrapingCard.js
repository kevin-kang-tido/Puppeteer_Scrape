import puppeteer from 'puppeteer';

// URL to scrape
const url = 'https://books.toscrape.com/';

// Create a function to scrape all cards
const scrapeAllCards = async () => {
  // Launch a new browser instance with a visible UI
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    // Go to the URL
    await page.goto(url, { waitUntil: 'load', timeout: 0 });

    // Wait for the product cards to be loaded
    await page.waitForSelector('.product_pod');

    const getBookData = await page.evaluate((url) => {
        // covert price to number 
        const convertPrice = (price) => {
            return parseFloat(price.replace('£',''))
        }

      // Get all book cards from the website
      const bookCards = Array.from(document.querySelectorAll('.product_pod'));

      // Map over each book card to extract the necessary data
      const data = bookCards.map((book) => ({
        title: book.querySelector('h3 a').getAttribute('title'),
        price: convertPrice(book.querySelector('.price_color').innerText),
        stock: book.querySelector('.instock.availability') ? book.querySelector('.instock.availability').innerText.trim() : 'Out of stock',
        productImage: url + book.querySelector('img').getAttribute('src'),
        star: book.querySelector('.star-rating').classList[1] || 'No rating',
      }));

      return data;
    }, url);

    console.log(getBookData);
  } catch (error) {
    console.error('Error scraping data:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
};

scrapeAllCards();
