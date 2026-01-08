import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from '../../Admin/AdminDashboard';

global.fetch = vi.fn();

describe('AdminDashboard', () => {
  it('skal rendre admin dashboard komponenten', () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
