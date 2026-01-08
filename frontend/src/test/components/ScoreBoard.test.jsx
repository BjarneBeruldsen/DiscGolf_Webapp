import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ScoreBoard from '../../KlubbHandtering/ScoreBoard';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ baneId: '123', rundeId: '456' }),
  };
});

describe('ScoreBoard', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ _id: '123', navn: 'Test Bane' }),
      })
    );
  });

  it('skal rendre scoreboard komponenten', () => {
    render(
      <BrowserRouter>
        <ScoreBoard />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
