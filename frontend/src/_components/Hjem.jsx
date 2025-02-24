import React from 'react';

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
        
        <div>

        </div>
    );
};

export default Hjem;