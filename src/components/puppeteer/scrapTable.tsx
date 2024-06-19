import React, { useState } from 'react';

// Define interfaces for the table data
interface TableRow {
  [key: string]: string | number; // Adjust the type based on your data
}

interface TableData {
  headers: string[];
  rows: TableRow[];
}

interface Schema {
  name: string;
  description: string;
  type: null;
  keys: Array<{
    columnName: string;
    primaryKey: boolean;
    foreignKey: boolean;
    referenceTable: null;
  }>;
  properties: Array<{
    dataType: string;
    columnName: string;
    required: boolean;
  }>;
}

const defaultSchema: Schema = {
  name: 'default_schema.json',
  description: 'This is a default schema',
  type: null,
  keys: [
    {
      columnName: 'id',
      primaryKey: true,
      foreignKey: false,
      referenceTable: null,
    },
  ],
  properties: [
    {
      dataType: 'string',
      columnName: 'example_column',
      required: true,
    },
  ],
};

export default function BaseTable() {
  const [tablesData, setTablesData] = useState<TableData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTableIndex, setSelectedTable] = useState<number | null>(null);
  const [schema, setSchema] = useState<Schema | null>(defaultSchema);
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [isSchemaEditing, setIsSchemaEditing] = useState(false);
  const [url, setUrl] = useState<string>('');

  const handleGenerateSchema = (table: TableData) => {
    const properties = table.headers.map(header => ({
      dataType: 'string', // Default data type, adjust as needed
      columnName: header,
      required: true, // Default to required, adjust as needed
    }));

    const generatedSchema: Schema = {
      name: `${table.headers.join('_')}.json`,
      description: `Generated schema for ${table.headers.join('_')}.json`,
      type: null,
      keys: [
        {
          columnName: 'id',
          primaryKey: true,
          foreignKey: false,
          referenceTable: null,
        },
      ],
      properties: properties,
    };
    setSchema(generatedSchema);
  };

  const handleFetchData = async () => {
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) {
        throw new Error('Network response is not ok!');
      }
      const data = await response.json();
      setTablesData(data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error fetching data');
    }
  };

  const handleSelectedTable = (index: number) => {
    setSelectedTable(index);
    handleGenerateSchema(tablesData[index]); // Generate schema for the selected table
  };

  const handleTableCellChange = (tableIndex: number, rowIndex: number, key: string, value: string | number) => {
    const updatedTablesData = [...tablesData];
    updatedTablesData[tableIndex].rows[rowIndex][key] = value;
    setTablesData(updatedTablesData);
  };

  const handleSchemaChange = (key: string, value: string) => {
    if (schema) {
      const updatedSchema = { ...schema, [key]: value };
      setSchema(updatedSchema);
    }
  };

  const handleSchemaPropertyChange = (propertyIndex: number, key: string, value: string | boolean) => {
    if (schema) {
      const updatedProperties = [...schema.properties];
      // @ts-ignore
      updatedProperties[propertyIndex][key] = value;
      setSchema({ ...schema, properties: updatedProperties });
    }
  };

  const toggleTableEditing = () => {
    setIsTableEditing(!isTableEditing);
  };

  const toggleSchemaEditing = () => {
    setIsSchemaEditing(!isSchemaEditing);
  };

  const handleSaveData = async () => {


    console.log('Tables Data:', tablesData);
    console.log('Schema:', schema);
    // Add your save logic here (e.g., send the data to an API)

    try{
      const postData  = await  fetch("https://idata-api.istad.co/api/v1/rest-api/",{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tablesData: tablesData,
          schema: schema,
          url: url,
          isTableEditing: isTableEditing,
          isSchemaEditing: isSchemaEditing,
          selectedTableIndex: selectedTableIndex,
          handleTableCellChange: handleTableCellChange,
          handleSchemaChange: handleSchemaChange,
          handleSchemaPropertyChange: handleSchemaPropertyChange,
          toggleTableEditing: toggleTableEditing,
          toggleSchemaEditing: toggleSchemaEditing,
          handleSelectedTable: handleSelectedTable,
          handleGenerateSchema: handleGenerateSchema,
          handleSaveData: handleSaveData,
          handleFetchData: handleFetchData,
        }),
      })
      console.log("Here is PostData: ",postData);

    }catch(e){
      console.log("Here is the error",e);
    }


  };

  return (
      <main>
        <h1 className="w-full mt-8 max-w-4xl mx-auto mb-8 font-bold text-3xl">Scrape Table</h1>
        <div className="w-full mt-8 max-w-4xl mx-auto mb-8 justify-between">
          <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className="w-[80%] px-4 py-2 border rounded"
          />
          <button
              onClick={handleFetchData}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mx-2"
          >
            Fetch Data
          </button>
        </div>
        {error ? (
            <div className="flex justify-center items-center h-screen font-bold text-5xl">
              <h1>{error}</h1>
            </div>
        ) : url.length === 0  ? (
            <div className="flex justify-center items-center h-screen font-light text-2xl">
              <h1>Please Input URL to Scrape Data</h1>
            </div>
        ): tablesData.length === 0 ? (
            <div className="flex justify-center items-center h-screen font-light text-2xl">
              <h1>Loading...</h1>
            </div>
        ) : (
            tablesData.map((tableData, tableIndex) => (
                selectedTableIndex === null || selectedTableIndex === tableIndex ? (
                    <div key={tableIndex}>
                      <div className="w-full mt-8 max-w-4xl mx-auto mb-8 flex justify-between">
                        <h1 className="font-bold text-2xl">Table {tableIndex + 1}</h1>
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => handleSelectedTable(tableIndex)}
                        >
                          Select
                        </button>
                      </div>
                      {selectedTableIndex !== null && (
                          <div className="w-full mt-4 max-w-4xl mx-auto mb-4 flex justify-between">
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={toggleTableEditing}
                            >
                              {isTableEditing ? 'Save Table' : 'Edit Table'}
                            </button>
                            <button
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                onClick={toggleSchemaEditing}
                            >
                              {isSchemaEditing ? 'Save Schema' : 'Edit Schema'}
                            </button>
                          </div>
                      )}
                      <table className="w-full max-w-4xl border-collapse mx-auto mb-8 shadow-lg">
                        <thead>
                        <tr className="bg-blue-500 text-white">
                          {tableData.headers.map((header, headerIndex) => (
                              <th key={headerIndex} className="border px-4 py-2 text-left">{header}</th>
                          ))}
                        </tr>
                        </thead>
                        <tbody>
                        {tableData.rows.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={`${rowIndex % 2 === 0 ? 'bg-gray-100' : 'bg-white'} hover:bg-gray-200 transition-colors duration-200`}
                            >
                              {Object.keys(row).map((key, cellIndex) => (
                                  <td key={cellIndex} className="border px-4 py-2">
                                    {isTableEditing ? (
                                        <input
                                            type="text"
                                            value={row[key]}
                                            onChange={(e) => handleTableCellChange(tableIndex, rowIndex, key, e.target.value)}
                                            className="w-full px-2 py-1"
                                        />
                                    ) : (
                                        row[key]
                                    )}
                                  </td>
                              ))}
                            </tr>
                        ))}
                        </tbody>
                      </table>
                      {selectedTableIndex === tableIndex && schema && (
                          <div className="w-full max-w-4xl mx-auto mt-8 p-4 border rounded shadow-lg">
                            <h2 className="font-bold text-xl">Table Schema</h2>
                            <pre className="bg-gray-100 p-2 rounded">
                             {JSON.stringify(schema, null, 2)}
                    </pre>
                            <div className="mb-4">
                              <label className="block font-bold mb-2">Name:</label>
                              {isSchemaEditing ? (
                                  <input
                                      type="text"
                                      value={schema.name}
                                      onChange={(e) => handleSchemaChange('name', e.target.value)}
                                      className="w-full px-2 py-1 border"
                                  />
                              ) : (
                                  <p>{schema.name}</p>
                              )}
                            </div>
                            <div className="mb-4">
                              <label className="block font-bold mb-2">Description:</label>
                              {isSchemaEditing ? (
                                  <input
                                      type="text"
                                      value={schema.description}
                                      onChange={(e) => handleSchemaChange('description', e.target.value)}
                                      className="w-full px-2 py-1 border"
                                  />
                              ) : (
                                  <p>{schema.description}</p>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold mb-2">Properties:</h3>
                              {schema.properties.map((property, propertyIndex) => (
                                  <div key={propertyIndex} className="mb-2 p-2 border rounded">
                                    <label className="block font-bold mb-1">Column Name:</label>
                                    {isSchemaEditing ? (
                                        <input
                                            type="text"
                                            value={property.columnName}
                                            onChange={(e) => handleSchemaPropertyChange(propertyIndex, 'columnName', e.target.value)}
                                            className="w-full px-2 py-1 border"
                                        />
                                    ) : (
                                        <p>{property.columnName}</p>
                                    )}
                                    <label className="block font-bold mb-1">Data Type:</label>
                                    {isSchemaEditing ? (
                                        <input
                                            type="text"
                                            value={property.dataType}
                                            onChange={(e) => handleSchemaPropertyChange(propertyIndex, 'dataType', e.target.value)}
                                            className="w-full px-2 py-1 border"
                                        />
                                    ) : (
                                        <p>{property.dataType}</p>
                                    )}
                                    <label className="block font-bold mb-1">Required:</label>
                                    {isSchemaEditing ? (
                                        <input
                                            type="checkbox"
                                            checked={property.required}
                                            onChange={(e) => handleSchemaPropertyChange(propertyIndex, 'required', e.target.checked)}
                                            className="mr-2"
                                        />
                                    ) : (
                                        <p>{property.required ? 'Yes' : 'No'}</p>
                                    )}
                                  </div>
                              ))}
                            </div>
                          </div>
                      )}
                      {selectedTableIndex !== null && (
                          <div className="w-full max-w-4xl mx-auto mt-4">
                            <button
                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                onClick={handleSaveData}
                            >
                              Save Data
                            </button>
                          </div>
                      )}
                    </div>
                ) : null
            ))
        )}
      </main>
  );
}
