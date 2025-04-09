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


/* //Mulig løsning, foreløpig funker løsningen som den er nå
//Kontakter backend for å endre brukerinformasjon
async function endreBruker(nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted, minne, setMelding, setBruker) {
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
      const oppdatertBruker = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bruker`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      const brukerData = await oppdatertBruker.json();
      setBruker(brukerData); //Henter brukerdata etter endring og setter det
      setTimeout(() => {
        minne.push("/Medlemskap");  
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
*/