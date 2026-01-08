import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Registrering from '../../BrukerHandtering/Registrering';

global.fetch = vi.fn();

describe('Registrering', () => {
  it('skal rendre registrering komponenten', () => {
    render(
      <BrowserRouter>
        <Registrering />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
