// Author: Bjarne Hovd Beruldsen

import { useParams, useHistory } from 'react-router-dom';
import UseFetch from './UseFetch';
import { useEffect, useState } from 'react';
import { sjekkKlubbnavn } from './validation';
import Nyhetsliste from './Nyhetsliste';
import BaneListe from './Baneliste';
import Turneringerliste from './Turneringerliste';
import Medlemmerliste from './Medlemmerliste';

const Klubbside = () => {
    const { id } = useParams(); // Henter id fra URL-parametrene
    const { data: klubb, laster, error } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`);
    const [nyttNavn, setNyttNavn] = useState('');
    const history = useHistory();
    const [errorMelding, setErrorMelding] = useState('');
    const [antLiker, setAntLiker] = useState(0);    
    const [visNyheter, setVisNyheter] = useState(true);
    const [visBaner, setVisBaner] = useState(false);
    const [visTurneringer, setVisTurneringer] = useState(false);
    const [visMedlemmer, setVisMedlemmer] = useState(false);
    const [valgtSeksjon, setValgtSeksjon] = useState('nyheter');

    useEffect(() => {
        
    }, [klubb]);

    const handleLiker = () => {
        setAntLiker(antLiker + 1);
        console.log(antLiker)
    }

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

    const handleVis = (seksjon) => {
        setValgtSeksjon(seksjon);
        setVisNyheter(seksjon === 'nyheter');
        setVisBaner(seksjon === 'baner');
        setVisTurneringer(seksjon === 'turneringer');
        setVisMedlemmer(seksjon === 'medlemmer');
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
        <div className="bg-gray-200">
            <div className="innhold ">
                { laster && <div>Laster...</div> }
                { error && <div>{ error }</div> }
                { klubb && (
                    <div>
                        <div className='topp-panel bg-white p-4 shadow w-full'>
                            <div className='overskrift border-b'>
                                <h2 className="text-3xl font-bold">{ klubb.klubbnavn }-Klubbside</h2>
                            </div>
                            <div className='knapper border-b'>
                                <button type="submit" className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Inviter
                                <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path>
                                </svg>
                                </button>
                                <button type="submit" className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Medlem
                                <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                </svg>
                                </button>
                            </div>
                            <div className='navbar p-2'>
                                <button onClick={() => handleVis('nyheter')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'nyheter' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Nyheter</button>
                                <button onClick={() => handleVis('baner')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'baner' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Baner</button>
                                <button onClick={() => handleVis('turneringer')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'turneringer' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Turneringer</button>
                                <button onClick={() => handleVis('medlemmer')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'medlemmer' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>Medlemmer</button>
                            </div>
                        </div>
                
                        {visNyheter && <Nyhetsliste nyheter={klubb.nyheter} handleLiker={handleLiker} antLiker={antLiker} />}
                        {visBaner && <BaneListe baner={klubb.baner}/>}
                        {visTurneringer && <Turneringerliste />}
                        {visMedlemmer && <Medlemmerliste/>}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Klubbside;