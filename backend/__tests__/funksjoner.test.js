const { beskyttetRute, sjekkBrukerAktiv, sjekkRolle } = require('../ruter/brukerhandtering/funksjoner');
const { getDb } = require('../db');

jest.mock('../db');

describe('Funksjoner - Tilgangskontroll', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      isAuthenticated: jest.fn(),
      user: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  describe('beskyttetRute', () => {
    it('skal tillate tilgang for autentiserte brukere', () => {
      req.isAuthenticated.mockReturnValue(true);
      beskyttetRute(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal avvise tilgang for uautentiserte brukere', () => {
      req.isAuthenticated.mockReturnValue(false);
      beskyttetRute(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Du må være logget inn for å få tilgang.',
      });
    });
  });

  describe('sjekkBrukerAktiv', () => {
    it('skal avvise hvis bruker ikke er autentisert', async () => {
      const mockCollection = {
        findOne: jest.fn(),
      };
      const mockDb = {
        collection: jest.fn(() => mockCollection),
      };
      getDb.mockReturnValue(mockDb);
      
      req.isAuthenticated.mockReturnValue(false);
      await sjekkBrukerAktiv(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('skal tillate tilgang for aktiv bruker', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue({ _id: '123', aktiv: true }),
      };
      const mockDb = {
        collection: jest.fn(() => mockCollection),
      };
      getDb.mockReturnValue(mockDb);

      req.isAuthenticated.mockReturnValue(true);
      req.user = { _id: '123' };

      await sjekkBrukerAktiv(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal avvise hvis bruker ikke finnes', async () => {
      const mockCollection = {
        findOne: jest.fn().mockResolvedValue(null),
      };
      const mockDb = {
        collection: jest.fn(() => mockCollection),
      };
      getDb.mockReturnValue(mockDb);

      req.isAuthenticated.mockReturnValue(true);
      req.user = { _id: '123' };

      await sjekkBrukerAktiv(req, res, next);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('sjekkRolle', () => {
    it('skal tillate tilgang for bruker med riktig rolle', () => {
      req.user = { rolle: 'hoved-admin' };
      const middleware = sjekkRolle(['hoved-admin', 'klubbadmin']);
      middleware(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal avvise tilgang for bruker uten riktig rolle', () => {
      req.user = { rolle: 'loggetInn' };
      const middleware = sjekkRolle(['hoved-admin']);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Ingen tilgang' });
    });

    it('skal avvise hvis bruker ikke har rolle', () => {
      req.user = {};
      const middleware = sjekkRolle(['hoved-admin']);
      middleware(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
