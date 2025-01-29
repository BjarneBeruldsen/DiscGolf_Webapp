import { useState, useEffect } from "react";

const Klubbsider = () => {
    const [klubber, setKlubber] = useState([]);

    useEffect(() => {
        console.log('Henter klubber');
        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setKlubber(data);
            })
            .catch(error => {
                console.error('Feil ved henting av klubber:', error);
            });
    }, []);

    return ( 
        <div className="innhold bg-gray-200 py-4 flex flex-col items-center">
            {klubber.map((klubb) => (
                <div className="klubbVisning bg-blue-300 mb-4 p-4 rounded-lg shadow max-w-md w-full" key={klubb._id}>
                    <h2 className="text-xl font-bold">{klubb.klubbnavn}</h2>
                    <p className="mt-4">{klubb.kontaktinfo}</p>
                </div>
            ))}
        </div>
     );
}
 
export default Klubbsider;