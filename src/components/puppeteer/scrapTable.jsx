import React, { useState, useEffect } from 'react';

export default function BaseTable() {

  const [tablesData, setTablesData] = useState([]);

  useEffect(() => {

    const fetchTablesData = async () => {

      try {
        const response = await fetch('/api/scrape');
        const data = await response.json();
        setTablesData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      
    };

    fetchTablesData();

  }, []);

  return (
    <>
      {tablesData.length === 0 ? (
        <p>Loading...</p>
      ) : (
        tablesData.map((tableData, tableIndex) => (
          <table key={tableIndex} className="table-fixed">
            <thead>
              <tr>
                {tableData.headers.map((header, headerIndex) => (
                  <th key={headerIndex}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {tableData.headers.map((header, cellIndex) => (
                    <td key={cellIndex}>{row[header]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ))
      )}
    </>
  );
}
