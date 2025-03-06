//Author: Laurent Zogaj

//Funksjon for å slette bruker
const SletteBruker = async (brukerInput, passord, setBruker, setMelding, history) => {
  setMelding("");

  //Kontakter backend for å slette bruker
  try {
    const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/SletteBruker`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ brukerInput, passord }),
    });

    const data = await respons.json();

    if (respons.ok) {
      setBruker(null); //Fjerner bruker
      setTimeout(() => {
        history.push("/Hjem");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }, 1000);
    } else {
      setMelding(data.error || "Ukjent feil oppstod.");
    }
  } catch (error) {
    setMelding("Uventet feil oppstod.");
  }
};

export default SletteBruker;