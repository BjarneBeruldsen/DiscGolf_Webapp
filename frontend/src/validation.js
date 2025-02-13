export const sjekkKlubbnavn = (klubbnavn) => { 
    if(klubbnavn.length < 3 || klubbnavn.length >= 40) {
        throw new Error('Klubbnavn må være mellom 3 og 40 tegn');
    }
    if(klubbnavn.match(/[^a-åA-Å0-9\s]/)) {
        throw new Error('Klubbnavn kan kun inneholde bokstaver og tall');
    }
}
export const sjekkKontaktinfo = (kontaktinfo) => {
    if(kontaktinfo.length < 8 || kontaktinfo.length >= 50) {
        throw new Error('Kontaktinfo må være mellom 3 og 50 tegn');
    }
    if(kontaktinfo.match(/[^a-åA-Å0-9\s@.]/)) {
        throw new Error('Mailadresse kan kun inneholde bokstaver, tall og @');
    }
}

