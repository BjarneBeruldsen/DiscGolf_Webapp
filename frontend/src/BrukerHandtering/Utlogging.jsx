//Author: Laurent Zogaj

//Funksjon for å logge ut bruker
const loggUtBruker = async (setLoggetInnBruker) => {
const setMelding = "";
    //Kontakter backend for å logge ut bruker
    try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
        });

        if (respons.ok) {
            setLoggetInnBruker(null); //Logger ut bruker
            window.location.reload(); //Tvinger en refresh 
            window.location.href = "/Hjem"; //Funker ikke med minne.push("/Hjem"); av en eller annen grunn
        }
    } catch (error) {
        setMelding("Feil ved utlogging", error);
    }
};

export default loggUtBruker;