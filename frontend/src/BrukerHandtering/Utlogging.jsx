//Author: Laurent Zogaj
const loggUtBruker = async () => {
    try {
        const respons = await fetch(`${process.env.REACT_APP_API_BASE_URL}/Utlogging`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });

        if (respons.ok) {
            localStorage.removeItem("bruker");
            window.location.reload();
            window.location.href = "/Hjem"; 
            return true; 
        } else {
            console.error("Utlogging feilet:", respons.statusText);
            return false;
        }
    } catch (error) {
        console.error("Feil ved utlogging:", error);
        return false;
    }
};

export default loggUtBruker;