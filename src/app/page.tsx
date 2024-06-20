'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function Home() {

    return (
        <main className='max-w-full mx-[200px] my-[100px]'>
            
            <Link href={`/card-scrapping/amazon-scrape`}>
              <div className="max-w-sm rounded overflow-hidden shadow-lg m-4">
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">Scrap Amazon Website</div>
                  <p className="text-gray-700 text-base">
                    Learn how to scrape product data from Amazon using Python and BeautifulSoup. This guide covers everything from setting up your environment to extracting and saving the data. Perfect for data enthusiasts and web developers.
                  </p>
                </div>
              </div>
            </Link>
            
        </main>
    );
}
