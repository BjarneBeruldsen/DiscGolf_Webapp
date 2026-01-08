import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Innlogging from '../../BrukerHandtering/Innlogging';

global.fetch = vi.fn();

describe('Innlogging', () => {
  it('skal rendre innlogging komponenten', () => {
    render(
      <BrowserRouter>
        <Innlogging setLoggetInnBruker={vi.fn()} />
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  it('skal vise feilmelding ved ugyldig brukernavn/epost', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Innlogging setLoggetInnBruker={vi.fn()} />
      </BrowserRouter>
    );

    await screen.findByRole('button', { name: /Logg inn/i });
    const inputs = Array.from(document.querySelectorAll('input'));
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    const brukernavnInput = inputs[0];
    const passordInput = inputs[1];
    const captchaInput = inputs[2];

    await user.type(brukernavnInput, '!!');
    await user.type(passordInput, 'Test123!');
    await user.type(captchaInput, '1');
    await user.click(screen.getByRole('button', { name: /Logg inn/i }));

    expect(
      await screen.findByText(/Skriv inn enten brukernavn/i)
    ).toBeInTheDocument();
  });

  it('skal avvise feil captcha', async () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.1);
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Innlogging setLoggetInnBruker={vi.fn()} />
      </BrowserRouter>
    );

    await screen.findByRole('button', { name: /Logg inn/i });
    const inputs = Array.from(document.querySelectorAll('input'));
    expect(inputs.length).toBeGreaterThanOrEqual(3);
    const brukernavnInput = inputs[0];
    const passordInput = inputs[1];
    const captchaInput = inputs[2];

    await user.type(brukernavnInput, 'testuser');
    await user.type(passordInput, 'Test123!');
    await user.type(captchaInput, '9');
    await user.click(screen.getByRole('button', { name: /Logg inn/i }));

    expect(screen.getByText(/Feil tall/i)).toBeInTheDocument();
    randomSpy.mockRestore();
  });
});
