//Author: Laurent Zogaj
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Klubbside from '../../KlubbHandtering/Klubbside';

// Mock useParams (beholder engelsk da det er teknisk term)
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: '123' }),
  };
});

describe('Klubbside', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: '123', klubbnavn: 'Test Klubb' }),
      })
    );
  });

  it('skal rendre klubbside komponenten', () => {
    render(
      <BrowserRouter>
        <Klubbside />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
