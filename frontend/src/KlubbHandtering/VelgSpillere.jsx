import { useState, useEffect } from "react";
import { validering } from './validation';
import UseFetch from "./UseFetch";
import HentBruker from "../BrukerHandtering/HentBruker";

const VelgSpillere = (props) => {
    const { bane, onBekreftSpillere, bruker } = props;
    const [leggTilVisning, setLeggTilVisning] = useState(false);
    const [nySpiller, setNySpiller] = useState('');
    const [spillere, setSpillere] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');
    const [brukere, setBrukere] = useState([]);
    const [sok, setSok] = useState('');
    const [filtrerteBrukere, setFiltrerteBrukere] = useState([]);

    const hentBrukere = async () => {
        try {
            const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/brukere`, {
                method: "GET",
                credentials: "include", // Sender cookies for autentisering
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!respons.ok) {
                throw new Error("Kunne ikke hente brukere");
            }
            const data = await respons.json();
            setBrukere(data);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        hentBrukere();
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
        setFiltrerteBrukere(
            brukere.filter(bruker =>
                bruker.brukernavn.toLowerCase().includes(sok.toLowerCase())
            )
        );
    }, [sok, brukere]);

    const handleLeggTilBruker = (bruker) => {
        const eksisterendeSpiller = spillere.find(spiller => spiller.id === bruker.id);
        if (!eksisterendeSpiller) {
            setSpillere([...spillere, { id: bruker.id, navn: bruker.brukernavn, poeng: 0, total: 0 }]);
        }
        setSok('');
    };

    const handleBekreftSpillere = () => {
        setErrorMelding('');
        if (spillere.length < 1) {
            setErrorMelding('Legg til minst en spiller');
            return;
        }
        onBekreftSpillere(spillere);
    };

    return (
        <div className="bg-gray-200">
            {bane && !leggTilVisning && (
                <div className="border rounded-lg shadow-lg bg-white m-8 p-8">
                    <div className="overskrft border-b">
                        <h2 className="text-xl font-bold">Bane: {bane.baneNavn}</h2>
                    </div>
                    <div className="midtpanel py-2 border-b">
                        <h3 className="text-md font-bold">Hvem skal spille?</h3>
                        <form>
                            <input
                                className="border rounded-lg px-2 py-1 mt-2"
                                type="text"
                                placeholder="Søk etter brukernavn"
                                value={sok}
                                onChange={(e) => setSok(e.target.value)}
                            />
                        </form>
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
                        <button onClick={() => setLeggTilVisning(true)} className="text-md border mt-4 rounded-lg px-2 py-1 text-white bg-gray-600 hover:bg-gray-500">+ Gjestespiller</button>
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
                        setLeggTilVisning(false);
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