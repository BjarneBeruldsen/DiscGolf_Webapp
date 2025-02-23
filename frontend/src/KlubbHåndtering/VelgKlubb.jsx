import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const VelgKlubb = () => {
    const [klubber, setKlubber] = useState([]);
    const [valgtKlubb, setValgtKlubb] = useState('');
    const minne = useHistory();
    const [laster, setLaster] = useState(false);


    useEffect(() => {
        setLaster(true);

        console.log('Henter klubber');
        fetch(`${process.env.REACT_APP_API_BASE_URL}/klubber`)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setKlubber(data);
                setLaster(false);
            })
            .catch(error => {
                console.error('Feil ved henting av klubber:', error);
                setLaster(false);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valgtKlubb) {
            minne.push(`/LagKlubbSide/${valgtKlubb}`);
        }
    };

    return (
        <div className="velg bg-gray-200 p-4  flex justify-center">
            <div className="innhold bg-gray-200 p-4">
                <h2 className="text-3xl font-bold mb-4">Velg en klubb</h2>
                <p className="mb-4">Ikke registrert klubb?</p>
                <Link to="/LagKlubb" className="text-blue-500 underline mb-4 block">Opprett ny klubb her</Link>
                <p className="mb-4">Velg en klubb du skal redigere side for:</p>
                <div className="nyhet-form mt-8 sm:mx-auto sm:w-full sm:max-w-md form-container">
                    <form onSubmit={handleSubmit} className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
                        <label className="block text-sm font-medium">
                            Klubber:
                        </label>
                        <div className="mt-2">
                            <select
                                name="klubber"
                                id="klubber"
                                value={valgtKlubb}
                                onChange={(e) => setValgtKlubb(e.target.value)}
                                className="w-full border border-gray-600 rounded-lg shadow-sm px-4 py-2 focus:outline-none focus:border-blue-500"
                            >
                                <option value="">Velg en klubb</option>
                                {klubber.map(klubb => (
                                    <option key={klubb._id} value={klubb._id}>{klubb.klubbnavn}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mt-4">
                        {!laster && <button type="submit" className="w-full flex justify-center py-4 bg-gray-500 rounded-lg text-sm text-white">Velg klubb</button>}
                        {laster && <button disabled className="w-full flex justify-center py-4 bg-gray-400 rounded-lg text-sm text-white">Velg klubb..</button>}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default VelgKlubb;