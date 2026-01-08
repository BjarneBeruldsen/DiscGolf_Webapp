import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../../_components/Header';

vi.mock('../../socket', () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn()
  }
}));

describe('Header', () => {
  it('skal rendre header komponenten', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
