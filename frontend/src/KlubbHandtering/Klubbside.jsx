/* 
Denne filen viser en klubbside med en navigasjonsbar for valg mellom klubbens nyheter, 
medlemmer, turneringer eller baner. Disse vises ved bruk av egne liste-komponenter.
*/

// Author: Bjarne Hovd Beruldsen.

import { useParams, useHistory } from 'react-router-dom';
import UseFetch from './UseFetch';
import { useEffect, useState } from 'react';
import { sjekkKlubbnavn } from './validation';
import Nyhetsliste from './Nyhetsliste';
import BaneListe from './Baneliste';
import Turneringerliste from './Turneringerliste';
import Medlemmerliste from './Medlemmerliste';
import HentBruker from '../BrukerHandtering/HentBruker';
import { useTranslation } from 'react-i18next';

const Klubbside = () => {
    const { t } = useTranslation();
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
    const {bruker, venter} = HentBruker();
    const [erMedlem, setErMedlem] = useState(false);

    //Henter brukerdata 
    useEffect(() => {
        if(bruker) {
            console.log("bruker:", bruker);
        }
    }, [bruker]);

    // Sjekker om brukeren er medlem i klubben
    useEffect(() => {
        if(klubb && bruker && klubb.medlemmer) {
            const erMedlem = klubb.medlemmer.some(medlem => medlem.id === bruker.id);
            setErMedlem(erMedlem);
        }
    }, [erMedlem, klubb, bruker]);


    //metode for å legge til nytt medlem i klubben 
    const handleUpdate = () => {
        const nyttMedlem = bruker;

        setErrorMelding('');
        const medlemmer = klubb.medlemmer || [];

        const erAlleredeMedlem = medlemmer.some(medlem => medlem.id === nyttMedlem.id);
        if (erAlleredeMedlem) {
            alert('Du er allerede medlem av denne klubben.');
            return;
        }

        const oppdatertMedlemmer = [...medlemmer, { id: nyttMedlem.id, navn: bruker.brukernavn }];

        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${id}`, {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ medlemmer: oppdatertMedlemmer })
        })
        .then(res => res.json())
        .then(data => {
            console.log('Klubb oppdatert:', data);
            window.location.reload();
        })
        .catch(error => {
            console.error('Feil ved oppdatering av klubbnavn:', error);
        });
    };

    //styrer visning av nyheter, baner, turneringer og medlemmer
    const handleVis = (seksjon) => {
        setValgtSeksjon(seksjon);
        setVisNyheter(seksjon === 'nyheter');
        setVisBaner(seksjon === 'baner');
        setVisTurneringer(seksjon === 'turneringer');
        setVisMedlemmer(seksjon === 'medlemmer');
    };

    //metode for å slette klubb
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
        <div className="bg-gray-200 flex flex-col min-h-screen">
            <div className="innhold flex-grow">
                { laster && <div>{t('Laster...')}</div> }
                { error && <div>{ error }</div> }
                { klubb && (
                    <div>
                        <div className='topp-panel bg-white p-4 shadow w-full'>
                            <div className='overskrift border-b'>
                                <h2 className="text-3xl font-bold">{klubb.klubbnavn}-{t('Klubbside')}</h2>
                            </div>
                            <div className='knapper border-b'>
                                <button onClick={handleUpdate} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">{t('Bli medlem')}
                                <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"></path>
                                </svg>
                                </button>
                                <button className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">
                                    {erMedlem ? (
                                        <>
                                            {t('Medlem')}
                                            <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"></path>
                                            </svg>
                                        </>
                                    ) : (
                                        t('Ikke medlem')
                                    )}
                                </button>
                            </div>
                            <div className='navbar p-2'>
                                <button onClick={() => handleVis('nyheter')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'nyheter' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Nyheter')}</button>
                                <button onClick={() => handleVis('baner')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'baner' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Baner')}</button>
                                <button onClick={() => handleVis('turneringer')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'turneringer' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Turneringer')}</button>
                                <button onClick={() => handleVis('medlemmer')} className={`justify-center py-2 px-2 m-2 text-sm ${valgtSeksjon === 'medlemmer' ? 'border-b-2 border-black-500' : 'rounded-lg bg-white text-gray hover:bg-gray-200'}`}>{t('Medlemmer')}</button>
                            </div>
                        </div>
                        {visNyheter && <Nyhetsliste nyheter={klubb.nyheter} antLiker={antLiker} />}
                        {visBaner && <BaneListe baner={klubb.baner}/>}      
                        {visTurneringer && <Turneringerliste />}            
                        {visMedlemmer && <Medlemmerliste medlemmer={klubb.medlemmer} />}  
                    </div>
                )}
            </div>
        </div>
    );
}

export default Klubbside;