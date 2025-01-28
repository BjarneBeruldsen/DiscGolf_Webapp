import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LagKlubbside = () => {
    const { id } = useParams();
    const [klubb, setKlubb] = useState(null);
    const [nyhetTittel, setNyhetTittel] = useState('');
    const [nyhet, setNyhet] = useState('');
    const [laster, setLaster] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8000/klubber/${id}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setLaster(false);
                setKlubb(data);
            })
            .catch(error => {
                console.error('Feil ved henting av klubb:', error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const nyNyhet = { nyhetTittel, nyhet };

        fetch(`http://localhost:8000/klubber/${id}/nyheter`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nyNyhet)
        }).then((response) => {
            if(!response.ok) {
                throw new Error('Feil ved lagring av nyhet');
            }
            else {
                return response.json();
            }
        }).then((data) => {
            console.log('Ny nyhet lagt til', data);
            setNyhetTittel('');
            setNyhet('');
            alert('Ny nyhet lagt til');
        }).catch(error => {
            console.error('Feil ved lagring av nyhet:', error);
        });
    };

    return (
        <div className="lagklubbside bg-gray-200 p-4">
            {klubb ? (
                <>
                    <h2 className="text-10xl font-bold">Opprett side for: {klubb.navn}</h2>
                    <p>Kontaktinfo: {klubb.kontaktinfo}</p>
                    <h3>Legg til baner</h3>
                    <p>Kommer senere..</p>
                    <h3>Legg til turneringer</h3>
                    <p>Kommer senere..</p>
    
                    <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                        <div className = "bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h3 className="font-sans">Legg til nyheter</h3>
                        <form onSubmit={handleSubmit}>
                            <label className="block text-sm font-medium">
                                Tittel: 
                            </label>
                            <div className="mt-2">
                            <input 
                                type="text" 
                                required
                                value={nyhetTittel}
                                onChange={(e) => setNyhetTittel(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm
                                           px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            </div>
                            <label className="block text-sm font-medium mt-2">
                                Nyhet:
                            </label>
                            <div className="mt-2">
                            <textarea
                                type="text"
                                required
                                rows="5"
                                cols="50"
                                value={nyhet}
                                onChange={(e) => setNyhet(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm
                                           px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            </div>
                           <button type="submit" className="w-full flex justify-center py-4 bg-blue-500 rounded-lg text-sm text-white">Legg til nyhet</button>
                        </form>
                        </div>
                    </div>
                </>
            ) : (
                <p>Laster klubbdata...</p>
            )}
        </div>
    );
}

export default LagKlubbside;