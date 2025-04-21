//Author: Abdinasir Ali
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sender...");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/KontaktOss`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(epostForm),
      });

      if (response.ok) {
        setStatus("Sendt");
        setEpostForm({
          navn: '',
          epost: '',
          melding: '',
        });

        setTimeout(() => {
          setStatus("Send");
        }, 3000);
      } else {
        throw new Error('Kunne ikke sende melding');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus("Error");
    }
  };
 

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[90vh] bg-no-repeat bg-cover zoomed-out-bg px-4"
      style={{
        backgroundImage: `url('https://zewailcity.edu.eg/_next/image?url=https%3A%2F%2Fzcadminpanel.zewailcity.edu.eg%2Fuploads%2Fcontactus_1c630b0d93.jpg&w=3840&q=75')`,
      }}
    >
      <form
        onSubmit={handleSubmit}className="flex flex-col items-center bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <h1 className="text-4xl font-bold text-black mb-8">Kontakt oss</h1>
        <div className="space-y-4 w-full">
          <input
            name="navn"
            value={epostForm.navn}
            onChange={handleInputChange}
            className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition"
            type="text"
            placeholder="Navn*"
            required
          />
          
         
          <input
            name="epost"
            value={epostForm.epost}
            onChange={handleInputChange}
            className="w-full h-12 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition"
            type="email"
            placeholder="Epost*"
            required
          />

          
          <textarea
            name="melding"
            value={epostForm.melding}
            onChange={handleInputChange}
            className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400 transition resize-none"
            maxLength={300}
            placeholder="Max 300 tegn*"
            required
          ></textarea>

         
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl w-full transition shadow"
          >
            {status}
          </button>{status === 'Sender...' && (<p className="text-center text-gray-500 text-sm mt-2">Sender meldingen...</p>)}
        </div>
      </form>
    </div>
  );
};

export default KontaktOss;

