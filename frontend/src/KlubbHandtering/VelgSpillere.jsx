import { useState, useEffect } from "react";
import { validering } from './validation';
import HentBruker from "../BrukerHandtering/HentBruker";

const VelgSpillere = (props) => {
    const { bane, onBekreftSpillere, bruker } = props;
    const [leggTilVisning, setLeggTilVisning] = useState(false);
    const [nySpiller, setNySpiller] = useState('');
    const [spillere, setSpillere] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');

    useEffect(() => {
        if (bruker) {
            setSpillere(prevSpillere => {
                // Sjekk om brukeren allerede er lagt til
                const eksisterendeSpiller = prevSpillere.find(spiller => spiller.id === bruker.id);
                if (!eksisterendeSpiller) {
                    return [...prevSpillere, { id: bruker.id, navn: bruker.bruker, poeng: 0, total: 0 }];
                }
                return prevSpillere;
            });
        }
    }, [bruker]);

    const handleClick = () => {
        setErrorMelding('');
        setLeggTilVisning(true);
    }

    const handleLeggTilSpiller = (e) => {
        setErrorMelding('');
        e.preventDefault();

        try {
            validering(nySpiller, 2, 20);
        } catch (error) {
            setErrorMelding(error.message);
            return;
        }
        setLeggTilVisning(false);
        const nyId = spillere.length > 0 ? spillere[spillere.length - 1].id + 1 : 1;
        setSpillere([...spillere, { id: nyId, navn: nySpiller, poeng: 0, total: 0 }]);
        setNySpiller('');
    }

    const handleBekreftSpillere = () => {
        setErrorMelding('');
        if (spillere.length < 1) {
            setErrorMelding('Legg til minst en spiller');
            return;
        }

        onBekreftSpillere(spillere);
    }

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
                                placeholder="Brukernavn(Kommer senere..)"
                            />
                        </form>
                        <button onClick={handleClick} className="text-md border mt-4 rounded-lg px-2 py-1 text-white bg-gray-600 hover:bg-gray-500">+ Gjestespiller</button>
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
                    <form onSubmit={handleLeggTilSpiller}>
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
}

export default VelgSpillere;