import { useState } from 'react';

const LagBane = ({ klubbId, onBaneLagtTil }) => {
    const [hullNr, setHullNr] = useState(1);
    const [avstand, setAvstand] = useState('');
    const [par, setPar] = useState('');
    const [baneNavn, setBaneNavn] = useState('');
    const [hull, setHull] = useState([]);
    const [errorMelding, setErrorMelding] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const nyttHull = { hullNr, avstand, par };
        setHull([...hull, nyttHull]);
        setHullNr(hullNr + 1);
        setAvstand('');
        setPar('');
    };

    const handleLagreBane = () => {
        const nyBane = { baneNavn, hull };

        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${klubbId}/baner`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nyBane)
        }).then((response) => {
            if (!response.ok) {
                throw new Error('Feil ved lagring av bane');
            } else {
                return response.json();
            }
        }).then((data) => {
            console.log('Ny bane lagt til', data);
            setHull([]);
            setHullNr(1);
            onBaneLagtTil();
        }).catch(error => {
            console.error('Feil ved lagring av bane:', error);
            setErrorMelding('Feil ved lagring av bane');
        });
    };

    return (
        <div className="lagbane-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container flex justify-center">
            <div className='bg-gray-100 mt-8 rounded-lg shadow p-4'>
                <div className='border rounded-lg font-bold text-xl bg-white flex justify-center py-4'>
                    <h2>Hull: { hullNr }</h2>
                </div>

                <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg sm:px-10 mt-4">
                    <label className='block font-medium mt-2'>
                        Avstand:
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        max="1000" //Vil tro at ingen er lengre enn 1km. 
                        required
                        value={avstand}
                        onChange={(e) => setAvstand(e.target.value)}
                        className="w-full border border-gray-600 rounded-lg shadow-sm
                                   px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                    />
                    <label className='block font-medium mt-2'>
                        Par:
                    </label>
                    <input 
                        type="number" 
                        min="1"
                        max="10" 
                        required
                        value={par}
                        onChange={(e) => setPar(e.target.value)}
                        className="w-full border border-gray-600 rounded-lg shadow-sm
                                   px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                    />
                    <label className='block font-medium mt-2'>
                        Start og sluttposisjon:
                    </label>

                    <h2>Her kommer valg av posisjon på kart..</h2>
                    <div className='flex items-center justify-between border rounded-lg px-4 py-2 mt-4'>
                        <label className='block font-medium mt-2'>
                            Legg til hull:
                        </label>
                        <button type="submit" className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow px-4 py-2">+</button>
                    </div>
                </form>
                
                <div className='bunn-panel m-4'>
                    <form>
                    <label className='block font-medium mt-2'>
                        Navn:
                    </label>
                    <input 
                        type="text"
                        required
                        value={baneNavn}
                        onChange={(e) => setBaneNavn(e.target.value)}
                        className="w-full border border-gray-600 rounded-lg shadow-sm
                                   px-4 py-2 focus:outline-none focus:border-blue-500 font-serif"
                    />
                    </form>
                    <button onClick={handleLagreBane} className="rounded-full bg-yellow-200 hover:bg-yellow-500 shadow mx-2 px-4 py-2 mt-4">Lagre bane</button>
                </div>
                {errorMelding && <p className='text-red-500'>{errorMelding}</p>}
            </div>
        </div>
    );
}

export default LagBane;