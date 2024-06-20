'use client';
import { useState } from 'react';
import { useCreateUserDefinitionMutation } from "@/redux/service/definitionService";
import { useAppDispatch } from "@/redux/hooks";
import {selectToken, setAccessToken} from "@/redux/features/auth/authSlice";
import SchemaForm from './SchemaForm';
import {useAppSelector} from "@/redux/hooks";

export default function CardScrapping() {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    // @ts-ignore
    const [selectedProduct, setSelectedProduct] = useState<Schema | null>(null);
    const [showSchemaPreview, setShowSchemaPreview] = useState(false);
    const [createUserDefinition] = useCreateUserDefinitionMutation();
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector(selectToken)

    const handleSearch = async () => {
        const res = await fetch(`/api/scrape/amazon-scrapping?searchTerm=${searchTerm}`);
        const data = await res.json();
        setProducts(data);
    };

    const handleGenerateSchema = (product: any) => {
        // @ts-ignore
        const schema: Schema = {
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
        };
        setSelectedProduct(schema);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, index: number | null = null) => {
        if (selectedProduct) {
            const updatedSchema = { ...selectedProduct };

            if (field === 'name' || field === 'description') {
                updatedSchema[field] = e.target.value;
            } else if (field === 'type') {
                updatedSchema.type = e.target.value;
            } else if (field === 'keys') {
                updatedSchema.keys[index!][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            } else if (field === 'properties') {
                updatedSchema.properties[index!][e.target.name] = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
            }

            setSelectedProduct(updatedSchema);
        }
    };

    const handleSchemaPreview = () => {
        setShowSchemaPreview(!showSchemaPreview);
    }

    const handleCreateDefinition = async () => {
        if (!selectedProduct) return;

        try {
            const uuid = '29a2b6cc-27ba-43a6-96ca-d093bc9ad958'; // Replace with actual UUID or fetch it dynamically
            await createUserDefinition({ uuid, schema: selectedProduct }).unwrap();
            // Handle success (e.g., show a success message or refresh data)
        } catch (error) {
            // Handle error
            console.error('Failed to create definition:', error);
        }
    };

    const handleLogin = async () => {
        const email = "srengchipor99@gmail.com";
        const password = "Jipor@09";

        fetch('http://localhost:3000/api' + '/login', {
            method: "POST",
            body: JSON.stringify({ email, password })
        }).then(res => res.json()).then(data => {
            console.log("Data in jwt test", data);
            dispatch(setAccessToken(data.accessToken))
        }).catch(err => console.log(err))
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
            <button className='ml-4 px-3 py-2 rounded-lg text-white font-semibold bg-blue-500'
                    onClick={handleSearch}>Search
            </button>

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
                                <button className='bg-green-600 text-white font-semibold px-3 py-2 rounded-lg text-sm'
                                        onClick={() => handleGenerateSchema(product)}>
                                    Generate Schema
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedProduct && (
                <SchemaForm
                    schema={selectedProduct}
                    onInputChange={handleInputChange}
                    onPreviewToggle={handleSchemaPreview}
                    showPreview={showSchemaPreview}
                />
            )}

            <button className='block bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg text-sm mt-4'
                    onClick={handleCreateDefinition}>
                Save definition
            </button>
            <button className='block bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg text-sm mt-4'
                    onClick={handleLogin}>
                Login
            </button>
        </div>
    );
}
