import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';


const LagKlubbside = () => {
    const { id } = useParams();
    const [klubb, setKlubb] = useState(null);
    const [nyhetTittel, setNyhetTittel] = useState('');
    const [nyhet, setNyhet] = useState('');
    const [laster, setLaster] = useState(false);
    const minne = useHistory();
    const [visNyhetForm, setVisNyhetForm] = useState(false);
    

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`)
            .then(res => res.json())
            .then(data => {
                console.log('Klubb hentet:', data);
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

        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}/nyheter`, {
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
            minne.push(`/`);
        }).catch(error => {
            console.error('Feil ved lagring av nyhet:', error);
        });
    };

    const behandleVisning = () => {
        setVisNyhetForm(true); 
    }

    return (
        <div className="flex justify-center bg-gray-200">
            
        
        <div className="lagklubbside p-4 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            {klubb ? (
                <>
                    <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 className="text-3xl font-bold">Opprett side for: {klubb.klubbnavn}</h2>
                        <p className="text-2xl font-bold">Kontaktinfo: {klubb.kontaktinfo}</p>
                    <h3 className="text-2xl font-bold">Legg til baner</h3>
                    <p>Kommer i senere versjon..</p>
                    <h3 className="text-2xl font-bold">Legg til turneringer</h3>
                    <p>Kommer i senere versjon..</p>
    

                    <h3 className="text-2xl font-bold">Legg til nyheter</h3>
                    <button onClick={ behandleVisning  } className="bg-gray-500 rounded-xl mt-4 text-white">Legg til nyhet</button>
                    </div>
                    {visNyhetForm && (
                    <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                        <div className = "bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h3 className="text-2xl font-bold">Legg til nyheter</h3>
                            <form onSubmit={handleSubmit}>
                            <label className="block text-sm font-medium">
                                Nyhetstittel: 
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
                            <div className="mt-4">
                            {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white">Legg til nyhet</button>}
                            {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-300 rounded-lg text-sm text-white">Legg til nyhet..</button>}
                            </div>
                        </form>
                        
                        </div>
                    </div>
                    )}
                </>
            ) : (
                <p>Laster klubbdata...</p>
            )}
        </div>
        </div>
    );
}

export default LagKlubbside;