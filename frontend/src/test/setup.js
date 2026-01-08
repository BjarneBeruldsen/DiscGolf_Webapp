import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import i18n from '../i18n';

// Mock fetch globalt
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Mock process.env for tester
process.env.REACT_APP_API_BASE_URL = 'http://localhost:8000';

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
