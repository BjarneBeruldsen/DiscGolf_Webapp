//Author: Laurent Zogaj

/* Denne filen kontakter backend for endring av brukerinformasjon.
Dette er da en asykron funksjon. Med parametere som holder på de nye verdiene som skal legges til eller endres fra tidligere.
Denne tar i mot det som kommer fra brukerinnstillinger.jsx og sender det videre til backend.
*/

//Kontakter backend for å endre brukerinformasjon
async function endreBruker(nyttBrukernavn, nyEpost, nyttPassord, passord, fornavn, etternavn, telefonnummer, bosted, minne, setMelding) {
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/bruker`, {
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