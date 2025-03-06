//Author: Laurent Zogaj

//Funksjon for å logge ut bruker
const loggUtBruker = async (setLoggetInnBruker) => {

    //Kontakter backend for å logge ut bruker
    try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (respons.ok) {
            setLoggetInnBruker(null); //Fjerner bruker
            window.location.reload();
            window.location.href = "/Hjem"; 
            return true; 
        } else {
            const data = await respons.json().catch(() => ({}));
            console.error("Utlogging feilet:", data.error || "Feil fra server");
            return false;
        }
    } catch (error) {
        console.error("Feil ved utlogging:", error);
        return false;
    }
};

export default loggUtBruker;