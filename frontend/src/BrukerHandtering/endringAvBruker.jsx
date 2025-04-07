//Author: Laurent Zogaj

//Kontakter backend for å endre brukerinformasjon
async function endreBruker(nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted, minne, setMelding) {
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/RedigerBruker`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted }),
    });
    //Henter respons fra backend
    const data = await respons.json();
    if (respons.ok) {
      setMelding("Brukerinformasjonen ble oppdatert!");
      setTimeout(() => {
        minne.push("/Medlemskap");  
        window.location.reload();
      }, 1000);
    } else {
      setMelding(data.error || "Noe gikk galt, prøv igjen senere.");
    }
  } catch (error) {
    console.error("Feil ved endring av brukerinformasjon:", error);
    setMelding("Feil ved endring av brukerinformasjon.");
  }
}

export default endreBruker;


/* //Tenkte å bruke dette for å re-hente brukerdata etter endring men må finne en måte å slå det sammen på
if (respons.ok) {
    setMelding("Brukerinformasjonen ble oppdatert!");
    const oppdatertBruker = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bruker`, {
        credentials: 'include'
    }).then(res => res.json());
    setBruker(oppdatertBruker); 
}
*/