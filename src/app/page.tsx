'use client'
import { useState } from 'react';

export default function Home() {
  const [urlInput, setUrlInput] = useState('');
  const [scrapedData, setScrapedData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (urlInput) {
      try {
        const response = await fetch('/api/scrape', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url: urlInput }),
        });
        const result = await response.json();
        if (response.ok) {
          setScrapedData(result.tablesData);
          setError(null);
        } else {
          setError(result.error);
        }
      } catch (error) {
        console.error('Error scraping data:', error);
        // setError('Failed to scrape data');
      }
    }
  };

  return (
    <>
      <h1 className='text-2xl my-12 font-bold flex justify-center items-center'>Scraping Table API</h1>
      <form onSubmit={handleSubmit} className='flex justify-center items-center bg-[#9ca3af] p-12'>
        <div className='mb-4'>
          <label className="text-2xl my-12 font-bold flex justify-center items-center" htmlFor="url-input">Please Input Your URL</label>
          <input
            id="url-input"
            type="text"
            className='p-6 h-6 w-96 items-center'
            placeholder="Enter your url..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
          />
        </div>

        <button type="submit" className="mt-28 mx-4 items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded">
          Submit
        </button>
      </form>

      {scrapedData && (
        <div>
          <h2 className="text-xl font-bold">Scraped Data</h2>
          <pre>{JSON.stringify(scrapedData, null, 2)}</pre>
        </div>
      )}

      {error && (
        <div>
          <h2 className="text-xl font-bold text-red-500">Error</h2>
          <p>{error}</p>
        </div>
      )}
    </>
  );
}
