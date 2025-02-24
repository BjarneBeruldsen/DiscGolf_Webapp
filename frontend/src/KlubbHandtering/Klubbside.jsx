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
    const [antLiker, setAntLiker] = useState(0);    

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
                                <button className="justify-center py-2 px-2 m-2 bg-white rounded-lg text-sm text-gray hover:bg-gray-200">Nyheter</button>
                                <button className="justify-center py-2 px-2 m-2 bg-white rounded-lg text-sm text-gray hover:bg-gray-200">Baner</button>
                                <button className="justify-center py-2 px-2 m-2 bg-white rounded-lg text-sm text-gray hover:bg-gray-200">Turneringer</button>
                                <button className="justify-center py-2 px-2 m-2 bg-white rounded-lg text-sm text-gray hover:bg-gray-200">Medlemmer</button>
                            </div>
                        </div>
                
                        { klubb.nyheter && klubb.nyheter.map((nyhet, index) => (
                            <div className='flex justify-center'>
                                <div key={index} className="m-4 bg-white rounded-lg shadow-sm p-4 w-full md:w-180">
                                    <div className='topp-panel border-b'>
                                        <h4 className="flex justify-center text-xl font-bold">{ nyhet.nyhetTittel }</h4>
                                        <p className="mt-2 flex justify-center">{ nyhet.nyhet }</p>
                                    </div>
                                    <div className='like&Kommenter border-b'>
                                        <button type="submit" onClick={handleLiker} className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Liker
                                        <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"></path>
                                        </svg>
                                        </button>
                                    
                                        <button type="submit" className="justify-center py-2 px-2 m-2 bg-gray-500 rounded-lg text-sm text-white hover:bg-gray-800">Kommenter
                                        <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"></path>
                                        </svg>
                                        </button>
                                    <div>
                                        <p>{antLiker}
                                        <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"></path>
                                        </svg>
                                        </p>
                                    </div>
                                    </div>
                                    <div className='kommentar input m-4 border border-gray-600 rounded-lg shadow-sm px-2 py-2 max'>
                                        <form>
                                            <input 
                                                type="text" 
                                                placeholder="Kommenterer som...(Brukernavn)" 
                                                className="focus:outline-none focus:border-blue-500 w-full p-2 border border-gray-300 rounded-lg"
                                            />
                                            <button type="submit" className="flex justify-between py-2 px-2 bg-gray-500 rounded-lg text-sm text-white mt-2 hover:bg-gray-800">Send
                                            <svg className="w-7 inline-block pl-2" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"></path>
                                            </svg>
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Klubbside;