import { useParams, useHistory } from 'react-router-dom';
import UseFetch from './UseFetch';
import { useState } from 'react';
import { sjekkKlubbnavn } from './validation';

const Klubbside = () => {
    const { id } = useParams(); // Henter id fra URL-parametrene
    const { data: klubb, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`);
    const [nyttNavn, setNyttNavn] = useState('');
    const history = useHistory();
    const [errorMelding, setErrorMelding] = useState('');

    const handleUpdate = () => {
        setErrorMelding('');
        try {
            sjekkKlubbnavn(nyttNavn);
        }
        catch(error) {
            setErrorMelding(error.message);
            return;
        }

        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ klubbnavn: nyttNavn })
        })
        .then(res => res.json())
        .then(data => {
            alert('Klubbnavn oppdatert');
            window.location.reload();
        })
        .catch(error => {
            console.error('Feil ved oppdatering av klubbnavn:', error);
        });
    };

    const handleDelete = () => {
        if (window.confirm('Er du sikker på at du vil slette klubben?')) {
            fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`, {
                method: 'DELETE'
            })
            .then(res => res.json())
            .then(data => {
                alert('Klubb slettet');
                history.push('/VelgKlubb');
            })
            .catch(error => {
                console.error('Feil ved sletting av klubb:', error);
            });
        }
    };

    return ( 
        <div className="flex justify-center bg-gray-200">
            <div className="innhold p-4 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                { laster && <div>Laster...</div> }
                { error && <div>{ error }</div> }
                { klubb && (
                    <article className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <h2 className="text-3xl font-bold">{ klubb.klubbnavn } sin klubbside</h2>
                        <p className="text-2xl font-bold">Kontaktinfo: { klubb.kontaktinfo }</p>
                        <h3 className="text-2xl font-bold mt-4">Nyheter: </h3>
                        { klubb.nyheter && klubb.nyheter.map((nyhet, index) => (
                            <div key={index} className="mt-4">
                                <h4 className="text-xl font-bold">{ nyhet.nyhetTittel }</h4>
                                <p className="mt-2">{ nyhet.nyhet }</p>
                            </div>
                        ))}
                        <div className="mt-4">
                            <input 
                                type="text" 
                                placeholder="Nytt klubbnavn" 
                                value={nyttNavn} 
                                onChange={(e) => setNyttNavn(e.target.value)} 
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                            <span className='text-red-500'>{errorMelding}</span>
                            <button onClick={handleUpdate} className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white mt-2">Oppdater klubbnavn</button>
                            <button onClick={handleDelete} className="w-full flex justify-center py-4 bg-red-500 rounded-lg text-sm text-white mt-2">Slett klubb</button>
                        </div>
                    </article>
                )}
            </div>
        </div>
    );
}

export default Klubbside;