import React, { useState } from 'react';

const KontaktOss = () => {
 
  const [epostForm, setEpostForm] = useState({
    navn: "",
    epost: "",
    melding: "",
  });

  
  const [status, setStatus] = useState("Send");

 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEpostForm({
          ...epostForm,  
          [name]: value,  
        });
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sender...");
   // console.log(epostForm); 
    
    
    setTimeout(() => {
      setStatus("Sendt");
      setEpostForm({
        navn: '',
        epost: '',
        melding: '',
    });

    setTimeout(() => {
        setStatus("Send");
      }, 3000);
    
    }, 2000);
    


};
 

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[90vh] bg-no-repeat bg-cover zoomed-out-bg"
      style={{
        backgroundImage: `url('https://zewailcity.edu.eg/_next/image?url=https%3A%2F%2Fzcadminpanel.zewailcity.edu.eg%2Fuploads%2Fcontactus_1c630b0d93.jpg&w=3840&q=75')`,
      }}
    >
      <h1 className="text-3xl mt-30 font-semibold text-white">Kontakt oss</h1>
      <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white p-8 rounded-lg shadow-md w-85">
        <div className="space-y-2 w-full">
          
          <input
            name="navn"
            value={epostForm.navn}
            onChange={handleInputChange}
            className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-blue-500 placeholder:text-gray-400"
            type="text"
            placeholder="Navn*"
            required
          />
          
         
          <input
            name="epost"
            value={epostForm.epost}
            onChange={handleInputChange}
            className="w-full h-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-blue-500 placeholder:text-gray-400"
            type="email"
            placeholder="Epost*"
            required
          />

          
          <textarea
            name="melding"
            value={epostForm.melding}
            onChange={handleInputChange}
            className="w-full h-28 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2
             focus:ring-blue-500 placeholder:text-gray-400"
            maxLength={300}
            placeholder="Max 300 tegn*"
            required
          ></textarea>

         
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 mt-4 rounded-lg w-full border border-gray-500"
          >
            {status}
           
          </button>
          <p>{status === 'Sender...' ? 'Sender Meldingen...' : null}</p>
        </div>
      </form>
    </div>
  );
};

export default KontaktOss;

