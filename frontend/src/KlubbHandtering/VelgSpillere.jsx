import { useState, useEffect } from "react";
import { validering } from './validation';
import UseFetch from "./UseFetch";
import HentBruker from "../BrukerHandtering/HentBruker";
import { useHistory } from "react-router-dom";
import InfoTooltip from "./infoTooltip";

const VelgSpillere = (props) => {
    const { bane, onBekreftSpillere, bruker } = props;
    const { data: brukere, error, isPending } = UseFetch(`${process.env.REACT_APP_API_BASE_URL}/spillere`);
    const [leggTilVisning, setLeggTilVisning] = useState(false);
    const [nySpiller, setNySpiller] = useState('');
    const [spillere, setSpillere] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');
    const [sok, setSok] = useState('');
    const [filtrerteBrukere, setFiltrerteBrukere] = useState([]);
    const [invitasjon, setInvitasjon] = useState({});
    const minne = useHistory();


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

    useEffect(() => {
        if (brukere && brukere.length > 0) {
            setFiltrerteBrukere(
                brukere.filter(bruker =>
                    bruker.brukernavn.toLowerCase().includes(sok.toLowerCase())
                )
            );
        }
    }, [sok, brukere]);

    const handleLeggTilBruker = (bruker) => {
        console.log('legg til bruker: ', bruker);
        const eksisterendeSpiller = spillere.find(spiller => spiller.id === bruker.id);
        if (!eksisterendeSpiller) {
            setSpillere([...spillere, { id: bruker._id, navn: bruker.brukernavn, poeng: 0, total: 0 }]);
        }
        console.log('spillere', spillere);
        setSok('');
    };

    const handleBekreftSpillere = () => {
        setErrorMelding('');
        if (spillere.length < 1) {
            setErrorMelding('Legg til minst en spiller');
            return;
        }
        onBekreftSpillere(spillere);
        console.log('spillere bekreftet:', spillere);
    };

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
            total: 0
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
                        <h2 className="text-xl font-bold">Bane: {bane.baneNavn}</h2>
                    </div>
                    <div className="midtpanel py-2 border-b">
                        <div className="flex justify-between items-center">
                            <h3 className="text-md font-bold">Legg til annen bruker:</h3>
                            <InfoTooltip tekst={
                            <>
                                Skriv inn brukernavn<br />
                                på en eksisterende bruker du ønsker å invitere. <br/>
                                Invitasjon sendes ved trykk på "bekreft spillere"
                            </>
                            } />
                        </div>
                        <form className="border-b py-2">
                            <input
                                className="border rounded-lg px-2 py-1 mt-2"
                                type="text"
                                placeholder="Søk etter brukernavn"
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
                                <h3 className="text-md font-bold">Legg til gjestespiller:</h3>
                                <InfoTooltip tekst={
                                <>
                                    Skriv inn kallenavn <br />
                                    på gjestespiller og trykk <br/>
                                    "Opprett spiller" for å legge <br />
                                    til gjestespiller i listen.
                                </>
                                } />
                            </div>
                            <form onSubmit={handleSubmitNySpiller} className="mt-4 ">
                                <input
                                    className="border rounded-lg px-2 py-1 text-md"
                                    type="text"
                                    placeholder="Navn"
                                    value={nySpiller}
                                    onChange={(e) => setNySpiller(e.target.value)}
                                />
                                <button type="submit" className="block mt-2 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white">Opprett gjestespiller</button>
                            </form>
                            {errorMelding && <p className="text-red-500">{errorMelding}</p>}
                        </div>
                    </div>
                    <div className="spillerliste">
                        <h3 className="text-md font-bold">Spillere:</h3>
                        {spillere.map(spiller => (
                            <div key={spiller.id} className="spiller border-b py-2">
                                <p>{spiller.navn}</p>
                            </div>
                        ))}
                    </div>
                    <div className="bekreft">
                        <button onClick={handleBekreftSpillere} className="border rounded-lg px-2 py-1 mt-2 text-md bg-gray-600 hover:bg-gray-500 text-white">Bekreft spillere</button>
                        {errorMelding && <p className="text-red-500">{errorMelding}</p>}
                    </div>
                </div>
            )}

            {leggTilVisning && (
                <div className="border rounded-lg shadow-lg bg-white m-8 p-8">
                    <p className="font-bold">Spillernavn:</p>
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
                            placeholder="Navn"
                            value={nySpiller}
                            onChange={(e) => setNySpiller(e.target.value)}
                        />
                        <div>
                            <button type="submit" className="mt-2 py-2 px-4 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm text-white">Opprett spiller</button>
                        </div>
                        {errorMelding && <p className="text-red-500">{errorMelding}</p>}
                    </form>
                </div>
            )}
        </div>
    );
};

export default VelgSpillere;