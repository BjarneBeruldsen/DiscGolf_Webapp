const {
  registreringValidering,
  innloggingValidering,
  loggeInnStopp,
  registreringStopp
} = require('../ruter/brukerhandtering/validering');
const { validationResult } = require('express-validator');

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

      for (const validator of registreringValidering) {
        await validator(req, {}, () => {});
      }

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

      for (const validator of registreringValidering) {
        await validator(req, {}, () => {});
      }

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

      for (const validator of registreringValidering) {
        await validator(req, {}, () => {});
      }

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

      for (const validator of innloggingValidering) {
        await validator(req, {}, () => {});
      }

      const errors = validationResult(req);
      expect(errors.isEmpty()).toBe(true);
    });
  });
});
