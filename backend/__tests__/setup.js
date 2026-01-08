// Testoppsett for mocking av database og andre avhengigheter
const { MongoClient } = require('mongodb');
const { jest } = require('@jest/globals');

// Mock database-tilkobling
jest.mock('../db', () => {
  const mockDb = {
    collection: jest.fn(() => ({
      findOne: jest.fn(),
      find: jest.fn(() => ({
        toArray: jest.fn(),
        forEach: jest.fn(),
      })),
      insertOne: jest.fn(),
      updateOne: jest.fn(),
      deleteOne: jest.fn(),
      deleteMany: jest.fn(),
    })),
  };

  return {
    getDb: jest.fn(() => mockDb),
    kobleTilDB: jest.fn((callback) => callback(null)),
  };
});

module.exports = {};
