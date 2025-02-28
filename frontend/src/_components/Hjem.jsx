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
    
       
       
<header>
    <div className=" text-grey-200 py-6 text-center bg-gray-40 justify-items-center space-y-2">
            <h1 className="text-2xl font-normal">Over 5,000 Baner</h1>
            <p className="text-lg text-[#656565]">Registrer resultater og forbedre din spillopplevelse</p>
            <div className="flex justify-center">
            <Link to="/KlubbHandtering/Baner">
                <h1 className="text-center bg-[#A09884] w-full max-w-sm px-9 py-1 rounded-3xl text-2xl text-white hover:scale-105">
                    Finn Bane
                </h1>
            </Link>
        </div>


        <h2 className="text-3xl font-bold text-gray-800 mt-20">Øk diskgolf opplevelsen din 🥏</h2>
        <div className="justify-items-center grid xl:grid-cols-3 mt-10 gap-3">
    <div 
        className="relative h-[500px] w-[470px] bg-cover bg-no-repeat rounded-lg "
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1575378912698-edc484585334?q=80&w=1943&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
    >
        <div className="absolute inset-0 bg-white opacity-70"></div> 
        <div className="relative p-4 mt-30">
            <h1 className="text-4xl text-left">Utforsk baner med venner</h1>
            <p className="mt-4 text-gray-600 leading-relaxed text-3xl text-left font-sans">
            Finn nye disc golf-baner, planlegg turer med venner, og opplev spennende utfordringer sammen!
            </p>
        </div>
    </div>

    <div 
        className="relative h-[500px] w-[470px] bg-cover bg-no-repeat rounded-lg "
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1725724767938-26e57f67a12c?q=80&w=2004&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
    >
        <div className="absolute inset-0 bg-white opacity-70"></div> 
        <div className="relative p-4 mt-30">
            <h1 className="text-4xl text-left">Delta i en klubb</h1>
            <p className="mt-4 text-gray-600 leading-relaxed text-3xl text-left">
            Bli med i en disc golf-klubb og bli en del av et engasjert fellesskap!
            </p>
        </div>
    </div>

    <div 
        className="relative h-[500px] w-[470px] bg-cover bg-no-repeat rounded-lg"
        style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1727727302419-9579e5f9f76e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`
        }}
    >
        <div className="absolute inset-0 bg-white opacity-70"></div>
        <div className="relative p-4 mt-30">
            <h1 className="text-4xl text-left ">Turneringer</h1>
            <p className="mt-4 text-gray-600 leading-relaxed text-3xl text-left">
            Delta i spennende turneringer og utfordr deg selv sammen med andre disc golf-spillere!
            </p>
        </div>
    </div>
</div>

        
    <h1 className="text-4xl font-sans mt-20 font-bold">Sjekk værforholdene før du spiller!</h1>
    <div className="flex justify-center mt-1 w-full ">
    
    <iframe 
        title="YR værmelding"
        src="https://www.yr.no/nb/innhold/1-72837/table.html" 
        className="w-full h-[550px] pointer-events-none"
        
    >
    </iframe>
    <div className="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0);"></div>

    </div>
   

        


        

    

</div>

  
     <div className="mt-8 grid">
            <button onClick={handleTommeTestdata} className="py-4 px-8 bg-red-500 rounded-lg text-sm text-white justify-self-end">
                Tøm testdata
            </button>
        </div>


</header>
        
    );
};

export default Hjem;