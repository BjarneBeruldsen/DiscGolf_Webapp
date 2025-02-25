import React from 'react';

const KontaktOss = () => {

    return (
        <div className="flex flex-col items-center justify-center min-h-[90vh] bg-no-repeat bg-cover zoomed-out-bg  "
        style={{ 
            backgroundImage: `url('https://zewailcity.edu.eg/_next/image?url=https%3A%2F%2Fzcadminpanel.zewailcity.edu.eg%2Fuploads%2Fcontactus_1c630b0d93.jpg&w=3840&q=75')`
          }}
        
        >
                        
                <h1 className='text-3xl mt-30 font-semibold'></h1>
                <form onSubmit=""
                className='flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-85'
                >
                    <h1 className='text-3xl  font-semibold'>Kontakt oss</h1>
                <div className="space-y-2">
                    <ul>
                    <input 
                    className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-gray-400 resize-none"
                    type="text" 
                    placeholder='Navn*'

                    
                    /></ul>
                    <ul>
                   <input 
                   className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  placeholder:text-gray-400 resize-none"
                    type="text" 
                    placeholder='Epost*'

                    
                    />
                    </ul>
                    <ul>
                    <textarea className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
                     focus:ring-blue-500  placeholder:text-gray-400 resize-none"
                    maxLength={300}
                    placeholder='Max 300 tegn*'
                    name="" 
                    id=""
                    
                    
                    ></textarea>
                    </ul>

                    <button type="submit" className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500">
                    Send
                    </button>

                </div>
                </form>
                    
           
        </div>
    );

};

export default KontaktOss;

