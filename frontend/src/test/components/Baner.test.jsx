import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Baner from '../../KlubbHandtering/Baner';

describe('Baner', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );
  });

  it('skal rendre baner komponenten', () => {
    render(
      <BrowserRouter>
        <Baner />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
