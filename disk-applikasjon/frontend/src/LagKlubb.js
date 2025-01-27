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
        
        fetch('http://localhost:8000/klubber', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(klubb)
        }).then((response) => {
            if(!response.ok) {
                throw new Error('Feil ved lagring av klubb');
            }
            else {
                return response.json();
            }
        }).then((data) => {
            console.log('Ny klubb lagt til', data);
            setLaster(false);
            alert('Ny klubb lagt til');
            minne.push(`/LagKlubbSide/${data.insertedId}`);
        }).catch(error => {
            console.error('Feil ved lagring av klubb:', error);
            setLaster(false); 
        });
    };

    return ( 
        <div className="lag">
            <h2>Legg Til en klubb</h2>
            <Link to="/VelgKlubb">Har allerede en klubb?</Link>
            <form onSubmit={handleSubmit}>
                <label>Klubbnavn:</label>
                <input 
                    type="text" 
                    required
                    value={klubbnavn}
                    onChange={(e) => setKlubbnavn(e.target.value)}
                />
                <label>Kontaktinfo:</label>
                <input 
                    type="text" 
                    required
                    value={kontaktinfo}
                    onChange={(e) => setKontaktinfo(e.target.value)}
                />
                {!laster && <button>Legg til klubb</button>}
                {laster && <button disabled>Legger til klubb..</button>}
            </form>
        </div>
    );
};

export default LagKlubb;