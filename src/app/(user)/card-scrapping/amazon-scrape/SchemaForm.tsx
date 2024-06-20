import React from 'react';

interface Key {
    columnName: string;
    primaryKey: boolean;
    foreignKey: boolean;
    referenceTable: string | null;
}

interface Property {
    dataType: string;
    columnName: string;
    required: boolean;
}

interface Schema {
    name: string;
    description: string;
    type: string | null;
    keys: Key[];
    properties: Property[];
}

interface SchemaFormProps {
    schema: Schema;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>, field: string, index?: number) => void;
    onPreviewToggle: () => void;
    showPreview: boolean;
}

const SchemaForm: React.FC<SchemaFormProps> = ({ schema, onInputChange, onPreviewToggle, showPreview }) => {
    return (
        <div>
            <h2 className='text-[24px] font-bold py-3'>Generated Schema:</h2>
            <form>
                <div className='mb-4'>
                    <label className='block font-bold mb-2'>Name:</label>
                    <input
                        className='w-full px-4 py-2 border rounded-lg'
                        type="text"
                        value={schema.name}
                        onChange={(e) => onInputChange(e, 'name')}
                    />
                </div>
                <div className='mb-4'>
                    <label className='block font-bold mb-2'>Description:</label>
                    <input
                        className='w-full px-4 py-2 border rounded-lg'
                        type="text"
                        value={schema.description}
                        onChange={(e) => onInputChange(e, 'description')}
                    />
                </div>
                <div className='mb-4'>
                    <label className='block font-bold mb-2'>Type:</label>
                    <input
                        className='w-full px-4 py-2 border rounded-lg'
                        type="text"
                        value={schema.type || ''}
                        onChange={(e) => onInputChange(e, 'type')}
                    />
                </div>
                <h3 className='text-[20px] font-semibold py-3'>Keys:</h3>
                {schema.keys.map((key, index) => (
                    <div className='mb-4' key={index}>
                        <label className='block font-bold mb-2'>Column Name:</label>
                        <input
                            className='w-full px-4 py-2 border rounded-lg'
                            type="text"
                            name="columnName"
                            value={key.columnName}
                            onChange={(e) => onInputChange(e, 'keys', index)}
                        />
                        <label className='block font-bold mb-2'>Primary Key:</label>
                        <input
                            type="checkbox"
                            name="primaryKey"
                            checked={key.primaryKey}
                            onChange={(e) => onInputChange(e, 'keys', index)}
                        />
                        <label className='block font-bold mb-2'>Foreign Key:</label>
                        <input
                            type="checkbox"
                            name="foreignKey"
                            checked={key.foreignKey}
                            onChange={(e) => onInputChange(e, 'keys', index)}
                        />
                        <label className='block font-bold mb-2'>Reference Table:</label>
                        <input
                            className='w-full px-4 py-2 border rounded-lg'
                            type="text"
                            name="referenceTable"
                            value={key.referenceTable || ''}
                            onChange={(e) => onInputChange(e, 'keys', index)}
                        />
                    </div>
                ))}
                <h3 className='text-[20px] font-semibold py-3'>Properties:</h3>
                {schema.properties.map((property, index) => (
                    <div className='mb-4' key={index}>
                        <label className='block font-bold mb-2'>Data Type:</label>
                        <input
                            className='w-full px-4 py-2 border rounded-lg'
                            type="text"
                            name="dataType"
                            value={property.dataType}
                            onChange={(e) => onInputChange(e, 'properties', index)}
                        />
                        <label className='block font-bold mb-2'>Column Name:</label>
                        <input
                            className='w-full px-4 py-2 border rounded-lg'
                            type="text"
                            name="columnName"
                            value={property.columnName}
                            onChange={(e) => onInputChange(e, 'properties', index)}
                        />
                        <label className='block font-bold mb-2'>Required:</label>
                        <input
                            type="checkbox"
                            name="required"
                            checked={property.required}
                            onChange={(e) => onInputChange(e, 'properties', index)}
                        />
                    </div>
                ))}
            </form>
            <button className='bg-blue-500 text-white font-semibold px-3 py-2 rounded-lg text-sm mt-4'
                    onClick={onPreviewToggle}>
                {showPreview ? 'Close Preview' : 'Preview Schema'}
            </button>

            {showPreview && (
                <div>
                  <pre style={{
                      backgroundColor: '#f4f4f4',
                      padding: '10px',
                      borderRadius: '5px',
                      overflowX: 'auto',
                      border: '1px solid #ddd'
                  }}>
                      {JSON.stringify(schema, null, 2)}
                  </pre>
                </div>
            )}
        </div>
    );
};

export default SchemaForm;
