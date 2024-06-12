import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');

    if (!searchTerm) {
        return NextResponse.json({ error: "Missing searchTerm query parameter" }, { status: 400 });
    }

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.amazon.com/s?k=${searchTerm}`);

    const products = await page.evaluate(() => {
        const items = Array.from(document.querySelectorAll('.s-main-slot .s-result-item'));
        return items.map(item => {
            const title = item.querySelector('h2 .a-link-normal')?.innerText || 'No title';
            const link = item.querySelector('h2 .a-link-normal')?.href || 'No link';
            const priceWhole = item.querySelector('.a-price-whole')?.innerText || '';
            const priceFraction = item.querySelector('.a-price-fraction')?.innerText || '';
            const price = priceWhole + priceFraction || 'No price';
            const image = item.querySelector('.s-image')?.src || 'No image';
            const description = item.querySelector('.a-text-normal')?.innerText || 'No description';
            return { title, link, price, image, description };
        });
    });

    await browser.close();

    return NextResponse.json(products);
}
