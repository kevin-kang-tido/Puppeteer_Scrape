'use client';
import { useState } from 'react';

export default function CardScrapping() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [showSchemaPreview, setShowSchemaPreview] = useState(false);

    const handleSearch = async () => {
        const res = await fetch(`/api/scrape?searchTerm=${searchTerm}`);
        const data = await res.json();
        setProducts(data);
    };

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

  interface ProductSchema {
    schema: Schema
  }

    const handleGenerateSchema = (product: any) => {
        const schema = {
            schema: {
                name: `${product.title.replace(/\s+/g, '_')}.json`,
                description: `Generated schema for ${product.title.replace(/\s+/g, '_')}.json`,
                type: null,
                keys: [
                    {
                        columnName: "id",
                        primaryKey: true,
                        foreignKey: false,
                        referenceTable: null
                    }
                ],
                properties: [
                    {
                        dataType: "string",
                        columnName: "title",
                        required: true
                    },
                    {
                        dataType: "string",
                        columnName: "link",
                        required: true
                    },
                    {
                        dataType: "string",
                        columnName: "price",
                        required: true
                    },
                    {
                        dataType: "string",
                        columnName: "image",
                        required: true
                    },
                    {
                        dataType: "string",
                        columnName: "description",
                        required: true
                    }
                ]
            }
        };
        setSelectedProduct(schema);
    };

    const handleInputChange = (e: any, field: any, index: any = null) => {
        if (selectedProduct) {
            const updatedSchema = { ...selectedProduct };

            if (field === 'name' || field === 'description') {
                updatedSchema.schema[field] = e.target.value;
            } else if (field === 'type') {
                updatedSchema.schema.type = e.target.value;
            } else if (field === 'keys') {
                updatedSchema.schema.keys[index][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            } else if (field === 'properties') {
                updatedSchema.schema.properties[index][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            }

            setSelectedProduct(updatedSchema);
        }
    };

    const handleSchemaPreview = () => {
      setShowSchemaPreview(true);
    }

    const handleCloseSchemaPreview = () => {
      setShowSchemaPreview(false);
    }

    return (
        <div className='max-w-full mx-[200px] my-[100px]'>
            <input
                className='px-4 py-3 bg-green-100 rounded-lg border-gray-600 border-[1px]'
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for products"
            />  
            <button className='ml-4 px-3 py-2 rounded-lg text-white font-semibold bg-blue-500' onClick={handleSearch}>Search</button>

            {products.length > 0 && (
                <div>
                    <h2 className='text-[24px] font-bold py-3'>Products:</h2>
                    <ul>
                        {products.map((product: any, index) => (
                            <li className='my-9' key={index}>
                                <h5 className='text-orange-600 font-semibold text-[16px]'>Title: {product.title}</h5>
                                <img src={product.image} alt={product.title} />
                                <p className='font-semibold text-[16px]'>Price: ${product.price}</p>
                                <p className='font-normal text-[14px]'>{product.description}</p>
                                <button className='bg-green-600 text-white font-semibold px-3 py-2 rounded-lg text-sm' onClick={() => handleGenerateSchema(product)}>
                                    Generate Schema
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedProduct && (
                <div>
                    <h2 className='text-[24px] font-bold py-3'>Generated Schema:</h2>
                    <form>
                        <div className='mb-4'>
                            <label className='block font-bold mb-2'>Name:</label>
                            <input
                                className='w-full px-4 py-2 border rounded-lg'
                                type="text"
                                value={selectedProduct.schema.name}
                                onChange={(e) => handleInputChange(e, 'name')}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block font-bold mb-2'>Description:</label>
                            <input
                                className='w-full px-4 py-2 border rounded-lg'
                                type="text"
                                value={selectedProduct.schema.description}
                                onChange={(e) => handleInputChange(e, 'description')}
                            />
                        </div>
                        <div className='mb-4'>
                            <label className='block font-bold mb-2'>Type:</label>
                            <input
                                className='w-full px-4 py-2 border rounded-lg'
                                type="text"
                                value={selectedProduct.schema.type || ''}
                                onChange={(e) => handleInputChange(e, 'type')}
                            />
                        </div>
                        <h3 className='text-[20px] font-semibold py-3'>Keys:</h3>
                        {selectedProduct.schema.keys.map((key: any, index: any) => (
                            <div className='mb-4' key={index}>
                                <label className='block font-bold mb-2'>Column Name:</label>
                                <input
                                    className='w-full px-4 py-2 border rounded-lg'
                                    type="text"
                                    name="columnName"
                                    value={key.columnName}
                                    onChange={(e) => handleInputChange(e, 'keys', index)}
                                />
                                <label className='block font-bold mb-2'>Primary Key:</label>
                                <input
                                    type="checkbox"
                                    name="primaryKey"
                                    checked={key.primaryKey}
                                    onChange={(e) => handleInputChange(e, 'keys', index)}
                                />
                                <label className='block font-bold mb-2'>Foreign Key:</label>
                                <input
                                    type="checkbox"
                                    name="foreignKey"
                                    checked={key.foreignKey}
                                    onChange={(e) => handleInputChange(e, 'keys', index)}
                                />
                                <label className='block font-bold mb-2'>Reference Table:</label>
                                <input
                                    className='w-full px-4 py-2 border rounded-lg'
                                    type="text"
                                    name="referenceTable"
                                    value={key.referenceTable || ''}
                                    onChange={(e) => handleInputChange(e, 'keys', index)}
                                />
                            </div>
                        ))}
                        <h3 className='text-[20px] font-semibold py-3'>Properties:</h3>
                        {selectedProduct.schema.properties.map((property: any, index: any) => (
                            <div className='mb-4' key={index}>
                                <label className='block font-bold mb-2'>Data Type:</label>
                                <input
                                    className='w-full px-4 py-2 border rounded-lg'
                                    type="text"
                                    name="dataType"
                                    value={property.dataType}
                                    onChange={(e) => handleInputChange(e, 'properties', index)}
                                />
                                <label className='block font-bold mb-2'>Column Name:</label>
                                <input
                                    className='w-full px-4 py-2 border rounded-lg'
                                    type="text"
                                    name="columnName"
                                    value={property.columnName}
                                    onChange={(e) => handleInputChange(e, 'properties', index)}
                                />
                                <label className='block font-bold mb-2'>Required:</label>
                                <input
                                    type="checkbox"
                                    name="required"
                                    checked={property.required}
                                    onChange={(e) => handleInputChange(e, 'properties', index)}
                                />
                            </div>
                        ))}
                    </form>
                    {
                      showSchemaPreview === false ? ( 
                      <button className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg text-sm mt-4' onClick={handleSchemaPreview}>
                        Preview Schema
                      </button> 
                      ) : (
                      <button className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg text-sm mt-4' onClick={handleCloseSchemaPreview}>
                        Close Preview
                      </button>
                      )
                    }
                </div>
            )}

            {showSchemaPreview && selectedProduct && (
                <div>
                  <pre style={{
                      backgroundColor: '#f4f4f4',
                      padding: '10px',
                      borderRadius: '5px',
                      overflowX: 'auto',
                      border: '1px solid #ddd'
                  }}>
                      {JSON.stringify(selectedProduct, null, 2)}
                  </pre>
              </div>
            )}
            
        </div>
    );
}