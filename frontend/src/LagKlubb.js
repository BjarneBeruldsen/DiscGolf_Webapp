import { useState } from 'react';   
import { useHistory } from 'react-router-dom';
import { Link } from 'react-router-dom';

const LagKlubb = () => {
    const [klubbnavn, setKlubbnavn] = useState('');
    const [kontaktinfo, setKontaktinfo] = useState('');
    const [laster, setLaster] = useState(false);
    const minne = useHistory();

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const klubb = { klubbnavn, kontaktinfo }; 

        setLaster(true); 
        
        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(klubb)
        }).then(() => {
            console.log('Ny klubb lagt til');
            setLaster(false);
            alert('Ny klubb lagt til');
            minne.push('/');
        })
        .catch(error => {
            console.error('Feil ved lagring av klubb:', error);
            setLaster(false); 
        });
    }

    return (
        <div className="lag bg-gray-200 p-4 mt-8 flex justify-center">
            <div className="w-full max-w-md">
                <h2 className="text-3xl font-bold mb-4 text-center">Legg Til en klubb</h2>
                <Link to="/VelgKlubb" className="text-blue-500 underline mb-4 block text-center">Har allerede en klubb?</Link>
                <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                    <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <label className="block text-sm font-medium mb-2">
                            Klubbnavn:
                        </label>
                        <div className="mt-2 mb-4">
                            <input 
                                type="text" 
                                required
                                value={klubbnavn}
                                onChange={(e) => setKlubbnavn(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <label className="block text-sm font-medium mb-2">
                            E-post:
                        </label>
                        <div className="mt-2 mb-4">
                            <input 
                                type="text" 
                                required
                                value={kontaktinfo}
                                onChange={(e) => setKontaktinfo(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="mt-4">
                            {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-blue-500 rounded-lg text-sm text-white">Legg til klubb</button>}
                            {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white">Legger til klubb..</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LagKlubb;