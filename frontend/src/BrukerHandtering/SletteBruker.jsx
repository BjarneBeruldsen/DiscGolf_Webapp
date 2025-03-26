//Author: Laurent Zogaj

//Funksjon for å slette bruker
const SletteBruker = async (brukerInput, passord, setBruker, minne) => {
const setMelding = "";

  //Kontakter backend for å slette bruker
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/SletteBruker`, {
      method: "DELETE",
      headers: {"Content-Type": "application/json"},
      credentials: "include",
      body: JSON.stringify({brukerInput, passord}), 
    });
    if (respons.ok) {
      setBruker(null); //Fjerner bruker
      window.location.reload();
      minne.push("/Hjem");
    }
  } catch (error) {
    setMelding("Feil ved sletting av bruker", error);
  }
};

export default SletteBruker;