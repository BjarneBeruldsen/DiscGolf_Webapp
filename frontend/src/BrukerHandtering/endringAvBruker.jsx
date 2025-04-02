//Author: Laurent Zogaj

//Kontakter backend for å endre brukerinformasjon
async function endreBruker(brukernavn, gammeltBrukernavn, epost, gammelEpost, nyttPassord, gammeltPassord, minne, setMelding) {
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/RedigerBruker`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ brukernavn, gammeltBrukernavn, epost, gammelEpost, nyttPassord, gammeltPassord }),
    });

    //Henter respons fra backend
    const data = await respons.json();
    if (respons.ok) {
      setMelding("Brukerinformasjonen ble oppdatert!");
      setTimeout(() => {
        minne.push("/Hjem");  
        window.location.reload();
      }, 2000);
    } else {
      setMelding("Noe gikk galt, prøv igjen senere.", data.error);
    }
  } catch (error) {
    setMelding("Feil ved endring av brukerinformasjon.", error);
  }
}

export default endreBruker;

//DENNE ER IKKE KLAR 