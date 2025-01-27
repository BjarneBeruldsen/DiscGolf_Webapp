import { Link, useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const VelgKlubb = () => {
    const [klubber, setKlubber] = useState(null);
    const [valgtKlubb, setValgtKlubb] = useState('');
    const minne = useHistory();

    useEffect(() => {
        console.log('Henter klubber');
        fetch('http://localhost:8000/klubber')
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data);
                setKlubber(data);
            })
            .catch(error => {
                console.error('Feil ved henting av klubber:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (valgtKlubb) {
            minne.push(`/LagKlubbSide/${valgtKlubb}`);
        }
    };

    return (
        <div className="innhold">
            <h2>Velg en klubb</h2>
            <Link to="/LagKlubb">Opprett ny klubb</Link>
            <p>Velg en klubb du skal lage side til:</p>
            <form onSubmit={handleSubmit}>
                <select
                    name="klubber"
                    id="klubber"
                    value={valgtKlubb}
                    onChange={(e) => setValgtKlubb(e.target.value)}
                >
                    <option value="">Velg en klubb</option>
                    {klubber && klubber.map(klubb => (
                        <option key={klubb._id} value={klubb._id}>{klubb.navn}</option>
                    ))}
                </select>
                <button type="submit">Velg klubb</button>
            </form>
        </div>
    );
}

export default VelgKlubb;