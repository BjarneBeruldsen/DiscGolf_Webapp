import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const LagKlubbSide = () => {
    const { id } = useParams();
    const [klubb, setKlubb] = useState(null);
    const [nyhetTittel, setNyhetTittel] = useState('');
    const [nyhet, setNyhet] = useState('');
    const [laster, setLaster] = useState(false);

    useEffect(() => {
        setLaster(true);
        fetch(`http://localhost:8000/klubber/${id}`)
            .then(res => {
                return res.json();
            })
            .then(data => {
                setLaster(false);
                setKlubb(data);
            })
            .catch(error => {
                console.error('Feil ved henting av klubb:', error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const nyheten = { nyhetTittel, nyhet };

        fetch(`http://localhost:8000/klubber/${id}/nyheter`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nyheten)
        }).then((response) => {
            if(!response.ok) {
                throw new Error('Feil ved lagring av nyhet');
            }
            else {
                return response.json();
            }
        }).then((data) => {
            console.log('Ny nyhet lagt til', data);
            setNyhetTittel('');
            alert('Ny nyhet lagt til');
        }).catch(error => {
            console.error('Feil ved lagring av nyhet:', error);
        });
    }

    return (
        <div className="lagklubbside">
            {klubb ? (
                <>
                    <h2>Opprett side for: {klubb.navn}</h2>
                    <p>Kontaktinfo: {klubb.kontaktinfo}</p>
                    <h3>Legg til baner</h3>
                    <p>Kommer senere..</p>
                    <h3>Legg til turneringer</h3>
                    <p>Kommer senere..</p>
                    <h3>Legg til nyheter</h3>
                    <form onSubmit={handleSubmit}>
                        <label>
                            Tittel: 
                        </label>
                        <input 
                            type="text" 
                            required
                            value={nyhetTittel}
                            onChange={(e) => setNyhetTittel(e.target.value)}
                        />
                        <label>
                            Nyhet:
                        </label>
                        <input
                            type="text"
                            required
                            value={nyhet}
                            onChange={(e) => setNyhet(e.target.value)}
                        />
                        {!laster && <button>Legg til klubb</button>}
                        {laster && <button disabled>Legger til klubb..</button>}
                    </form>
                </>
            ) : (
                <p>Laster klubbdata...</p>
            )}
        </div>
    );
}

export default LagKlubbSide;