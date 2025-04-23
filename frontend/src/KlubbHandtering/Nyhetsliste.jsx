// Author: Bjarne Hovd Beruldsen
import React, { useEffect, useState } from 'react';
import HentBruker from '../BrukerHandtering/HentBruker';

const Nyhetsliste = ({ nyheter, handleLiker }) => {
    const [kommentar, setKommentar] = useState('');
    const {bruker, venter} = HentBruker();
    const [visKommentar, setVisKommentar] = useState(false);

    useEffect(() => {
        const savedVisKommentar = localStorage.getItem('visKommentar');
        if (savedVisKommentar !== null) {
            setVisKommentar(JSON.parse(savedVisKommentar));
        }
    }, []);

    const handleKommenter = async (nyhet) => {
        if (!bruker) {
            alert('Du må være innlogget for å kommentere.');
            return;
        }
        if (!kommentar) {
            alert('Vennligst fyll inn kommentar.');
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber/${nyhet.klubbId}/nyheter/${nyhet._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kommentar, brukernavn: bruker.brukernavn }),
            });

            if (!response.ok) {
                throw new Error('Feil ved lagring av kommentar');
            }

            alert('Kommentar lagt til!');
            window.location.reload();
            setKommentar('');
        } catch (error) {
            console.error('Feil ved lagring av kommentar:', error);
        }
    };

    const handleClick = () => {
        const newVisKommentar = !visKommentar;
        setVisKommentar(newVisKommentar);
        localStorage.setItem('visKommentar', JSON.stringify(newVisKommentar));
    }

    return (
        <div className='min-h-[100vh]'>
            {nyheter && nyheter.length > 0 ? (
                nyheter.map((nyhet, index) => (
                    <div className='flex justify-center' key={index}>
                        <div className="m-4 bg-white rounded-lg shadow-sm p-4 w-full md-w-180">
                            <div className='topp-panel'>
                                <h4 className="flex justify-center text-xl font-bold">{nyhet.nyhetTittel}</h4>
                                <p className="mt-2 flex justify-center border-b">{nyhet.nyhet}</p>
                                {nyhet.fil && (
                                    <p className="mt-2 flex justify-center">
                                        <a href={`${process.env.REACT_APP_API_BASE_URL}/filer/${nyhet.fil}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                                            Last ned PDF
                                        </a>
                                    </p>
                                )}
                                <button onClick={handleClick} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Kommenter
                                    <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"></path>
                                    </svg>
                                </button>
                            </div>
                            {visKommentar && (
                            <div className='kommentar input m-4 border border-gray-600 rounded-lg shadow-sm px-2 py-2 max'>
                                <form onSubmit={(e) => { e.preventDefault(); handleKommenter(nyhet); }}>
                                    <input
                                        type="text"
                                        placeholder="Skriv en kommentar..."
                                        value={kommentar}
                                        onChange={(e) => setKommentar(e.target.value)}
                                        className="focus:outline-none focus:border-blue-500 w-full p-2 border border-gray-300 rounded-lg"
                                    />
                                    <button type="submit" className="flex justify-between py-2 px-2 bg-gray-500 rounded-lg text-sm text-white mt-2 hover:bg-gray-800">Send
                                        <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"></path>
                                        </svg>
                                    </button>
                                </form>
                                <div className="mt-4">
                                    <h5 className="font-bold">Kommentarer:</h5>
                                    {nyhet.kommentarer && nyhet.kommentarer.length > 0 ? (
                                        nyhet.kommentarer.map((kom, idx) => (
                                            <div className='kommentar bg-gray-100 p-2 rounded-lg mt-2' key={idx}>
                                                <p key={idx} className="mt-2">
                                                    <strong>{kom.brukernavn}:</strong> {kom.kommentar}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Ingen kommentarer ennå.</p>
                                    )}
                                </div>
                            </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className='flex justify-center min-h-[100vh]'>
                    <h1>Ingen nyheter tilgjengelig...</h1>
                </div>
            )}
        </div>
    );
};

export default Nyhetsliste;