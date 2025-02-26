// Author: Bjarne Hovd Beruldsen
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { sjekkNyhetTittel, sjekkNyhet } from './validation';
import LagBane from './LagBane';
import LagTurnering from './LagTurnering';

const LagKlubbside = () => {
    const { id } = useParams();
    const [klubb, setKlubb] = useState(null);
    const [nyhetTittel, setNyhetTittel] = useState('');
    const [nyhet, setNyhet] = useState('');
    const [laster, setLaster] = useState(false);
    const minne = useHistory();
    const [visNyhetForm, setVisNyhetForm] = useState(false);
    const [visBaneForm, setVisBaneForm] = useState(false);
    const [visTurneringForm, setVisTurneringForm] = useState(false);
    const [errorMelding, setErrorMelding] = useState('');    

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

        try {
            sjekkNyhetTittel(nyhetTittel);
            sjekkNyhet(nyhet);
        }
        catch(error) {
            setErrorMelding(error.message);
            setLaster(false);
            return;
        }

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

    const behandleVisning = (seksjon) => {
        setVisNyhetForm(seksjon === 'nyhet'); 
        setVisBaneForm(seksjon === 'bane');
        setVisTurneringForm(seksjon === 'turnering')
    }

    const behandleVisningBane = () => {
        setVisBaneForm(!visBaneForm);
        setVisNyhetForm(false); 
    }

    const handleBaneLagtTil = () => {
        setVisBaneForm(false);
        alert('Ny bane lagt til');
    }


    return (
        <div className=" bg-gray-200">
            <div className="lagklubbside p-4 mt-8">
                {klubb ? (
                    <>
                        <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                            <div className='overskriftpanel bg-white border-b'>
                                <h2 className="text-3xl font-bold">Klubb: {klubb.klubbnavn}</h2>
                                <p className="text-2xl font-bold">Kontaktinfo: {klubb.kontaktinfo}</p>
                            </div>
                            <div className='flex justify-center'>
                            <button onClick={() => behandleVisning("nyhet")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Nyhet
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            <button onClick={() => behandleVisning("bane")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Bane
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            <button onClick={() => behandleVisning("turnering")} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Turnering
                                <svg className="w-6 inline-block" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                            </button>
                            </div>
                        </div>
                        {visNyhetForm && (
                            <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                                <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
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
                                        <span className='text-red-500'>{ errorMelding }</span>
                                        <div className="mt-4">
                                            {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white mt-2">Legg til nyhet</button>}
                                            {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-300 rounded-lg text-sm text-white">Legg til nyhet..</button>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                        {visBaneForm && <LagBane klubbId={id} onBaneLagtTil={handleBaneLagtTil} />}
                        {visTurneringForm && <LagTurnering klubbId={id} />}
                    </>
                ) : (
                    <p>Laster klubbdata...</p>
                )}
            </div>
        </div>
    );
}

export default LagKlubbside;