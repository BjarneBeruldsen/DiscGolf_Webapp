import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Innlogging from '../../BrukerHandtering/Innlogging';

global.fetch = vi.fn();

describe('Innlogging', () => {
  it('skal rendre innlogging komponenten', () => {
    render(
      <BrowserRouter>
        <Innlogging />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
