/*  
Denne filen lar brukeren velge spillere til en bane, inkludert gjestespillere, 
og sende invitasjoner. 
*/
// Author: Bjarne Hovd Beruldsen
import { useState, useEffect } from "react";
import { validering } from './validation';
import UseFetch from "./UseFetch";
import HentBruker from "../BrukerHandtering/HentBruker";
import { useHistory } from "react-router-dom";
import InfoTooltip from "./infoTooltip";
import { useTranslation } from 'react-i18next';

const VelgSpillere = (props) => {
    const { t } = useTranslation();
    const { bane, onBekreftSpillere, bruker } = props;
    const { data: brukere, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/spillere`);
    const [leggTilVisning, setLeggTilVisning] = useState(false);
    const [nySpiller, setNySpiller] = useState('');
    const [spillere, setSpillere] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');
    const [sok, setSok] = useState('');
    const [filtrerteBrukere, setFiltrerteBrukere] = useState([]);
    const [invitasjon, setInvitasjon] = useState({});
    const [antInviterte, setAntInviterte] = useState(0);
    const minne = useHistory();


    // Henter brukeren og sjekker om den er logget inn
    useEffect(() => {
        if (bruker) {
            setSpillere(prevSpillere => {
                const eksisterendeSpiller = prevSpillere.find(spiller => spiller.id === bruker.id);
                if (!eksisterendeSpiller) {
                    return [...prevSpillere, { id: bruker.id, navn: bruker.brukernavn, poeng: 0, total: 0 }];
                }
                return prevSpillere;
            });
        }
    }, [bruker]);

    // Henter spillere fra API når komponenten lastes inn
    useEffect(() => {
        if (brukere && brukere.length > 0) {
            setFiltrerteBrukere(
                brukere.filter(bruker =>
                    bruker.brukernavn.toLowerCase().includes(sok.toLowerCase())
                )
            );
        }
    }, [sok, brukere]);

    //legger til spiller i listen
    const handleLeggTilBruker = (bruker) => {
        if(bruker._id === props.bruker.id) {
            setErrorMelding('Du kan ikke invitere deg selv');
            return; 
        }
        console.log('legg til bruker: ', bruker);
        const eksisterendeSpiller = spillere.find(spiller => spiller.id === bruker.id);
        if (!eksisterendeSpiller) {
            setSpillere([...spillere, { id: bruker._id, navn: bruker.brukernavn, poeng: 0, total: 0 }]);
            setAntInviterte(prevAntall => prevAntall + 1);
        }
        console.log('spillere', spillere);
        setSok('');
    };

    //legger valgte spillere i en liste som sendes til Scoreboard
    const handleBekreftSpillere = () => {
        setErrorMelding('');
        if (spillere.length < 1) {
            setErrorMelding('Legg til minst en spiller');
            return;
        }
        onBekreftSpillere(spillere, antInviterte);
        console.log('spillere bekreftet:', spillere);
    };

    //legger til gjestespiller i listen
    const handleSubmitNySpiller = (e) => {
        e.preventDefault();
        if (nySpiller.trim() === '') {
            setErrorMelding('Navn kan ikke være tomt');
            return;
        }
        const nyGjestespiller = {
            id: `guest-${Date.now()}`, // Unik ID for gjestespiller
            navn: nySpiller,
            poeng: 0,
            total: 0, 
        };
        setSpillere([...spillere, nyGjestespiller]);
        setNySpiller('');
        setErrorMelding('');
    };

    return (
        <div className="bg-gray-200">
            {bane && !leggTilVisning && (
                <div className="border rounded-lg shadow-lg bg-white m-8 p-8">
                    <div className="overskrft border-b">
                        <h2 className="text-xl font-bold">{t('Bane')}: {bane.baneNavn}</h2>
                    </div>
                    <div className="midtpanel py-2 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-bold">{t('Legg til annen bruker')}:</h3>
                            <InfoTooltip tekst={
                            <>
                                {t('Skriv inn brukernavn på alle')}<br />
                                {t('eksisterende brukere du ønsker å invitere.')} <br/>
                                {t('Invitasjon sendes ved trykk på "bekreft spillere"')}
                            </>
                            } />
                        </div>
                        <form className="border-b py-2">
                            <input
                                className="border rounded-lg px-2 py-1 mt-2"
                                type="text"
                                placeholder={t('Søk etter brukernavn')}
                                value={sok}
                                onChange={(e) => setSok(e.target.value)}
                            />
                        
                        {filtrerteBrukere.length > 0 && sok.trim() !== '' && (
                            <ul className="border rounded-lg mt-2 bg-white">
                                {filtrerteBrukere.map(bruker => (
                                    <li
                                        key={bruker._id}
                                        className="py-1 px-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleLeggTilBruker(bruker)}
                                    >
                                        {bruker.brukernavn}
                                    </li>
                                ))}
                            </ul>
                        )}
                        </form>
                        <div className="py-2">
                            <div className="flex justify-between items-center">
                                <h3 className="text-md font-bold">{t('Legg til gjestespiller')}:</h3>
                                <InfoTooltip tekst={
                                <>
                                    {t('Skriv inn kallenavn')} <br />
                                    {t('på gjestespiller og trykk')} <br/>
                                    {t('+"-knappen for å legge')} <br />
                                    {t('til gjestespillere i listen.')}
                                </>
                                } />
                            </div>
                            <form onSubmit={handleSubmitNySpiller} className="mt-4 ">
                                <input
                                    className="border rounded-lg px-2 py-1 text-md"
                                    type="text"
                                    placeholder={t('Navn')}
                                    value={nySpiller}
                                    onChange={(e) => setNySpiller(e.target.value)}
                                />
                                <button type="submit" className="inline-block mt-2 ml-1 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-full text-sm text-white">+</button>
                            </form>
                        </div>
                    </div>
                    <div className="spillerliste">
                        <h3 className="text-md font-bold">{t('Spillere')}:</h3>
                        {spillere.map(spiller => (
                            <div key={spiller.id} className="spiller border-b py-2">
                                <p>{spiller.navn}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bekreft">
                        <button onClick={handleBekreftSpillere} className="border rounded-lg px-2 py-1 mt-2 text-md bg-gray-600 hover:bg-gray-500 text-white">{t('Bekreft spillere')}</button>
                        {errorMelding && <p className="text-red-500">{errorMelding}</p>}
                    </div>
                </div>
            )}

            {leggTilVisning && (
                <div className="border rounded-lg shadow-lg bg-white m-8 p-8">
                    <p className="font-bold">{t('Spillernavn')}:</p>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (nySpiller.trim() === '') {
                            setErrorMelding('Navn kan ikke være tomt');
                            return;
                        }
                        const nyGjestespiller = {
                            id: `guest-${Date.now()}`, // Unik ID for gjestespiller
                            navn: nySpiller,
                            poeng: 0,
                            total: 0
                        };
                        setSpillere([...spillere, nyGjestespiller]);
                        setNySpiller('');
                        setLeggTilVisning(false);
                        setErrorMelding('');
                    }}>
                        <input
                            className="border rounded-lg px-2 py-1 mt-2 text-md"
                            type="text"
                            placeholder={t('Navn')}
                            value={nySpiller}
                            onChange={(e) => setNySpiller(e.target.value)}
                        />
                        <div>
                            <button type="submit" className="mt-2 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white">{t('Opprett spiller')}</button>
                        </div>
                        {errorMelding && <p className="text-red-500">{errorMelding}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default VelgSpillere;