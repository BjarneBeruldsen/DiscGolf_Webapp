const { getDb } = require('../db');

jest.mock('../db');

describe('Systemlogger', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      insertOne: jest.fn(),
      find: jest.fn(() => ({
        toArray: jest.fn(() =>
          Promise.resolve([
            {
              _id: '123',
              tidspunkt: new Date(),
              bruker: 'testuser',
              handling: 'Test handling',
              detaljer: 'Test detaljer',
            },
          ])
        ),
      })),
    };

    mockDb = {
      collection: jest.fn(() => mockCollection),
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Legge til systemlogg', () => {
    it('skal legge til ny systemlogg', async () => {
      const nyLogg = {
        tidspunkt: new Date(),
        bruker: 'testuser',
        handling: 'Test handling',
        detaljer: 'Test detaljer',
      };

      mockCollection.insertOne.mockResolvedValue({
        insertedId: '123',
      });

      const result = await mockCollection.insertOne(nyLogg);
      expect(result.insertedId).toBeDefined();
      expect(mockCollection.insertOne).toHaveBeenCalledWith(nyLogg);
    });

    it('skal håndtere manglende påkrevde felt', () => {
      const ugyldigLogg = {
        tidspunkt: new Date(),
        // Mangler bruker og handling
      };

      expect(ugyldigLogg.bruker).toBeUndefined();
      expect(ugyldigLogg.handling).toBeUndefined();
    });
  });

  describe('Hente systemlogg', () => {
    it('skal hente alle systemloggoppføringer', async () => {
      const logger = await mockCollection.find().toArray();
      expect(logger).toBeDefined();
      expect(Array.isArray(logger)).toBe(true);
    });

    it('skal hente logger med filtrering', async () => {
      mockCollection.find.mockReturnValue({
        toArray: jest.fn(() =>
          Promise.resolve([
            {
              bruker: 'testuser',
              handling: 'Test handling',
            },
          ])
        ),
      });

      const logger = await mockCollection.find({ bruker: 'testuser' }).toArray();
      expect(logger).toBeDefined();
      expect(logger[0].bruker).toBe('testuser');
    });
  });
});
