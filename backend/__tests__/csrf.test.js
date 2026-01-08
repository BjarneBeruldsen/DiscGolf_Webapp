const { csrfProtection, getCsrfToken } = require('../ruter/csrf');
const crypto = require('crypto');

describe('CSRF Protection', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/test',
      headers: {},
      body: {},
      cookies: {},
      session: {}
    };
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      locals: {}
    };
    next = jest.fn();
  });

  describe('csrfProtection', () => {
    it('skal tillate GET requests uten CSRF token', () => {
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal tillate HEAD requests uten CSRF token', () => {
      req.method = 'HEAD';
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal tillate OPTIONS requests uten CSRF token', () => {
      req.method = 'OPTIONS';
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });

    it('skal generere token hvis ingen finnes i session', () => {
      req.method = 'POST';
      csrfProtection(req, res, next);
      expect(req.session.csrfToken).toBeDefined();
      expect(res.cookie).toHaveBeenCalled();
    });

    it('skal avvise POST request uten gyldig token', () => {
      req.method = 'POST';
      req.session.csrfToken = 'test-token';
      csrfProtection(req, res, next);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid CSRF token' });
    });

    it('skal akseptere POST request med gyldig token', () => {
      req.method = 'POST';
      const token = crypto.randomBytes(32).toString('hex');
      req.session.csrfToken = token;
      req.headers['x-csrf-token'] = token;
      req.cookies['csrf-token'] = token;
      csrfProtection(req, res, next);
      expect(next).toHaveBeenCalled();
    });
  });

  describe('getCsrfToken', () => {
    it('skal generere og returnere CSRF token', () => {
      getCsrfToken(req, res);
      expect(req.session.csrfToken).toBeDefined();
      expect(res.cookie).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({
        csrfToken: req.session.csrfToken
      });
    });
  });
});
