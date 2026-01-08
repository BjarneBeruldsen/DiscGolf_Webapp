const {
  registreringValidering,
  innloggingValidering,
  nyttPassordValidering,
  lagKlubbValidering,
  turneringValidering,
  mobileTurneringValidering
} = require('../ruter/brukerhandtering/validering');
const { validationResult } = require('express-validator');

const runValidators = async (validators, req) => {
  for (const validator of validators) {
    await validator(req, {}, () => {});
  }
};

describe('Validering', () => {
  describe('registreringValidering', () => {
    it('skal validere gyldig brukernavn', async () => {
      const req = {
        body: {
          brukernavn: 'testuser123',
          passord: 'Test123!',
          bekreftPassord: 'Test123!',
          epost: 'test@example.com'
        }
      };

      await runValidators(registreringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });

    it('skal avvise for kort brukernavn', async () => {
      const req = {
        body: {
          brukernavn: 'ab',
          passord: 'Test123!',
          bekreftPassord: 'Test123!',
          epost: 'test@example.com'
        }
      };

      await runValidators(registreringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });

    it('skal avvise ugyldig e-post', async () => {
      const req = {
        body: {
          brukernavn: 'testuser123',
          passord: 'Test123!',
          bekreftPassord: 'Test123!',
          epost: 'invalid-email'
        }
      };

      await runValidators(registreringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('innloggingValidering', () => {
    it('skal validere gyldig brukernavn eller e-post', async () => {
      const req = {
        body: {
          brukernavn: 'testuser',
          passord: 'Test123!'
        }
      };

      await runValidators(innloggingValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });
  });

  describe('nyttPassordValidering', () => {
    it('skal avvise hvis passordene ikke matcher', async () => {
      const req = {
        body: {
          nyttPassord: 'NyttPass1!',
          bekreftPassord: 'UliktPass2!'
        }
      };

      await runValidators(nyttPassordValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('lagKlubbValidering', () => {
    it('skal validere gyldig klubbinput', async () => {
      const req = {
        body: {
          klubbnavn: 'Test Klubb',
          kontaktinfo: 'kontakt@test.no'
        }
      };

      await runValidators(lagKlubbValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });

    it('skal avvise ugyldig kontaktinfo', async () => {
      const req = {
        body: {
          klubbnavn: 'Test Klubb',
          kontaktinfo: 'ikke-epost'
        }
      };

      await runValidators(lagKlubbValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('turneringValidering', () => {
    it('skal validere gyldig turnering', async () => {
      const req = {
        body: {
          navn: 'Vinter Cup',
          dato: '2025-01-15',
          bane: 'Test Bane',
          beskrivelse: 'Kort beskrivelse'
        }
      };

      await runValidators(turneringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });

    it('skal avvise ugyldig dato', async () => {
      const req = {
        body: {
          navn: 'Vinter Cup',
          dato: 'ikke-dato',
          bane: 'Test Bane'
        }
      };

      await runValidators(turneringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });

  describe('mobileTurneringValidering', () => {
    it('skal validere gyldig mobilturnering', async () => {
      const req = {
        body: {
          navn: 'Mobil Cup',
          beskrivelse: 'Kort beskrivelse',
          dato: '2025-01-20',
          sted: 'Oslo',
          adresse: 'Gate 1',
          deltakere: 10,
          premiepott: '5000',
          kontakt: 'Testperson'
        }
      };

      await runValidators(mobileTurneringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });

    it('skal avvise ugyldig antall deltakere', async () => {
      const req = {
        body: {
          navn: 'Mobil Cup',
          beskrivelse: 'Kort beskrivelse',
          dato: '2025-01-20',
          sted: 'Oslo',
          adresse: 'Gate 1',
          deltakere: 0,
          premiepott: '5000',
          kontakt: 'Testperson'
        }
      };

      await runValidators(mobileTurneringValidering, req);
      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(false);
    });
  });
});
