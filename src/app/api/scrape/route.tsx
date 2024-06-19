import puppeteer from 'puppeteer';

export async function POST(req: Request) {
    const { url } = await req.json();

    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'load', timeout: 0 });

        const tablesData = await page.evaluate(() => {
            const tables = document.querySelectorAll('table');
            return Array.from(tables).map(table => {
                const headers:any = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
                const rows:any = Array.from(table.querySelectorAll('tr')).slice(1).map(row => {
                    const cells = Array.from(row.querySelectorAll('td')).map(td => td.innerText.trim());
                    const rowData:any = {};
                    cells.forEach((cell, i) => {
                        rowData[headers[i] || `Cell ${i + 1}`] = cell;
                    });
                    return rowData;
                });
                return { headers, rows };
            });
        });

        await browser.close();
        return new Response(JSON.stringify(tablesData), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error('Error scraping data:', error);
        return new Response(JSON.stringify({ error: 'Error scraping data' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
}
