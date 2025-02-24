export const validering = (tekst, minLengde, maxLengde) => {
    if (tekst.length < minLengde || tekst.length > maxLengde) {
        throw new Error(`Teksten må være mellom ${minLengde} og ${maxLengde} tegn`);
    }
}


export const sjekkKlubbnavn = (klubbnavn) => { 
    if (klubbnavn.length < 3 || klubbnavn.length >= 40) {
        throw new Error('Klubbnavn må være mellom 3 og 40 tegn');
    }
    if (klubbnavn.match(/[^a-åA-Å0-9\s]/)) {
        throw new Error('Klubbnavn kan kun inneholde bokstaver og tall');
    }
}

export const sjekkKontaktinfo = (kontaktinfo) => {
    if (kontaktinfo.length < 8 || kontaktinfo.length >= 50) {
        throw new Error('Kontaktinfo må være mellom 8 og 50 tegn');
    }
    if (kontaktinfo.match(/[^a-åA-Å0-9\s@.]/)) {
        throw new Error('Mailadresse kan kun inneholde bokstaver, tall og @');
    }
}

export const sjekkNyhetTittel = (nyhetTittel) => {
    if (nyhetTittel.length < 5 || nyhetTittel.length >= 100) {
        throw new Error('Nyhetstittel må være mellom 5 og 100 tegn');
    }
}

export const sjekkNyhet = (nyhet) => {
    validering(nyhet, 10, 1000);
}

