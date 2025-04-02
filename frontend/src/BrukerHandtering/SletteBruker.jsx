//Author: Laurent Zogaj

//Funksjon for å slette bruker
const SletteBruker = async (brukerInput, passord, setBruker, setMelding, minne) => {
setMelding("");

  //Kontakter backend for å slette bruker
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/SletteBruker`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({brukerInput, passord}), 
    });
    const data = await respons.json();
    if (!respons.ok) {
      console.error("Sletting av bruker feilet:", data);
      setMelding("Feil ved sletting av bruker. Sjekk brukernavn eller passord og prøv igjen.");
    } else { 
      setMelding("Bruker er nå slettet, du blir nå sendt til hjemmesiden");
      setTimeout(() => {
        setBruker(null);
        minne.push("/Hjem");  
        window.location.reload();
      }, 2000);
    }
  } catch (error) {
    setMelding("Feil ved sletting av bruker", error);
  }
};

export default SletteBruker;