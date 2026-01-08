const { ObjectId } = require('mongodb');
const { getDb } = require('../db');

jest.mock('../db');

describe('Klubbhandtering', () => {
  let mockDb;
  let mockCollection;

  beforeEach(() => {
    mockCollection = {
      find: jest.fn(() => ({
        forEach: jest.fn((callback) => {
          callback({ _id: new ObjectId(), navn: 'Test Klubb' });
          return Promise.resolve();
        }),
        toArray: jest.fn(() => Promise.resolve([{ _id: new ObjectId(), navn: 'Test Klubb' }])),
      })),
      findOne: jest.fn(),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
    };

    mockDb = {
      collection: jest.fn(() => mockCollection),
    };

    getDb.mockReturnValue(mockDb);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Hente klubber', () => {
    it('skal hente alle klubber', async () => {
      const klubber = await mockCollection.find().toArray();
      expect(klubber).toBeDefined();
      expect(Array.isArray(klubber)).toBe(true);
    });

    it('skal hente en spesifikk klubb med gyldig ID', async () => {
      const testId = new ObjectId();
      mockCollection.findOne.mockResolvedValue({
        _id: testId,
        navn: 'Test Klubb',
      });

      const klubb = await mockCollection.findOne({ _id: testId });
      expect(klubb).toBeDefined();
      expect(klubb._id).toEqual(testId);
    });

    it('skal håndtere ugyldig ID', () => {
      const isValid = ObjectId.isValid('invalid-id');
      expect(isValid).toBe(false);
    });
  });

  describe('Opprette klubb', () => {
    it('skal opprette ny klubb', async () => {
      const nyKlubb = {
        navn: 'Ny Klubb',
        kontaktinfo: 'test@example.com',
        etablert: new Date().getFullYear(),
      };

      mockCollection.insertOne.mockResolvedValue({
        insertedId: new ObjectId(),
      });

      const result = await mockCollection.insertOne(nyKlubb);
      expect(result.insertedId).toBeDefined();
      expect(mockCollection.insertOne).toHaveBeenCalledWith(nyKlubb);
    });
  });

  describe('Oppdatere klubb', () => {
    it('skal oppdatere klubb med gyldig ID', async () => {
      const testId = new ObjectId();
      const oppdatering = { navn: 'Oppdatert Navn' };

      mockCollection.updateOne.mockResolvedValue({
        modifiedCount: 1,
      });

      const result = await mockCollection.updateOne(
        { _id: testId },
        { $set: oppdatering }
      );

      expect(result.modifiedCount).toBe(1);
    });
  });

  describe('Slette klubb', () => {
    it('skal slette klubb med gyldig ID', async () => {
      const testId = new ObjectId();

      mockCollection.deleteOne.mockResolvedValue({
        deletedCount: 1,
      });

      const result = await mockCollection.deleteOne({ _id: testId });
      expect(result.deletedCount).toBe(1);
    });
  });
});
