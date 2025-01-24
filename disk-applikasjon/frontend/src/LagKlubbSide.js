import { useState } from 'react';   

const LagKlubbSide = () => {

    const [klubbnavn, setKlubbnavn] = useState('');
    const [kontaktinfo, setKontaktinfo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault(); 
        const klubb = {klubbnavn, kontaktinfo}; 
        
        fetch('http://localhost:8000/klubber', {
            method: 'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(klubb)
        }).then(() => {
            console.log('Ny klubb lagt til');
            alert('Ny klubb lagt til');
        })
        .catch(error => {
            console.error('Feil ved lagring av klubb:', error);
        })
    }

    return ( 
        <div className="lag">
            <h2>Legg Til en klubb</h2>
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
                    onChange={(e) => setKontaktinfo(e.target.value)}
                />
                <button>Legg til klubb</button>
            </form>
        </div>
     );
}
 
export default LagKlubbSide;