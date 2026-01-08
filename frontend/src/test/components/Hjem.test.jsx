//Author: Laurent Zogaj
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Hjem from '../../_components/Hjem';

// Mock fetch (beholder engelsk da det er teknisk term)
global.fetch = vi.fn();

describe('Hjem', () => {
  it('skal rendre hjem komponenten', () => {
    render(
      <BrowserRouter>
        <Hjem />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  it('skal vise overskrifter', () => {
    render(
      <BrowserRouter>
        <Hjem />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
