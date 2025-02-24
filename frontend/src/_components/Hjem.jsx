import React from 'react';
import { Link } from "react-router-dom";

const Hjem = () => {
    const handleTommeTestdata = () => {
        if (window.confirm('Er du sikker på at du vil tømme all testdata?')) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/tommeTestdata`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message);
            })
            .catch(error => {
                console.error('Feil ved tømming av testdata:', error);
            });
        }
    };
  
   
  

    return ( 
    
       //Midlertidig deaktivert grunnet designing av frontend hjem
       /* <div className="flex justify-center items-center mt-8 h-[40vh]">
            <button onClick={handleTommeTestdata} className="py-4 px-8 bg-red-500 rounded-lg text-sm text-white">
                Tøm testdata
            </button>
        </div>*/
<header>
    <div className=" text-grey-200 py-6 text-center bg-gray-40">
        <h1 className="text-2xl font-normal">Over 5,000 Baner</h1>
        <p className="text-lg text-[#656565]">Registrer resultater og forbedre din spillopplevelse</p>
        <div className="flex justify-center">
        <Link to="/KlubbHandtering/Baner">
            <h1 className="text-center bg-[#A09884] w-full max-w-sm px-9 py-1 rounded-3xl text-2xl text-white hover:scale-105">
                Finn Bane
            </h1>
        </Link>
    </div>
    </div>

  
    


</header>
        
    );
};

export default Hjem;