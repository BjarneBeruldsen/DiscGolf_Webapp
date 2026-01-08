//Author: Laurent Zogaj
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('skal vise feilmelding når passordene ikke matcher', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Registrering />
      </BrowserRouter>
    );

    await screen.findByRole('button', { name: /Registrer deg/i });
    const inputs = Array.from(document.querySelectorAll('input'));
    expect(inputs.length).toBeGreaterThanOrEqual(4);
    const epostInput = inputs[0];
    const brukernavnInput = inputs[1];
    const passordInputs = [inputs[2], inputs[3]];
    const captchaInput = inputs[4];

    await user.type(epostInput, 'test@example.com');
    await user.type(brukernavnInput, 'testuser');
    await user.type(passordInputs[0], 'Test123!');
    await user.type(passordInputs[1], 'Test124!');
    await user.type(captchaInput, '1');
    const form = document.querySelector('form');
    fireEvent.submit(form);

    expect(
      await screen.findByText(/Passordene stemmer ikke overens/i)
    ).toBeInTheDocument();
  });

  it('skal vise feilmelding ved ugyldig e-post', async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Registrering />
      </BrowserRouter>
    );

    await screen.findByRole('button', { name: /Registrer deg/i });
    const inputs = Array.from(document.querySelectorAll('input'));
    expect(inputs.length).toBeGreaterThanOrEqual(4);
    const epostInput = inputs[0];
    const brukernavnInput = inputs[1];
    const passordInputs = [inputs[2], inputs[3]];
    const captchaInput = inputs[4];

    await user.type(epostInput, 'ikke-epost');
    await user.type(brukernavnInput, 'testuser');
    await user.type(passordInputs[0], 'Test123!');
    await user.type(passordInputs[1], 'Test123!');
    await user.type(captchaInput, '1');
    const form = document.querySelector('form');
    fireEvent.submit(form);

    expect(
      await screen.findByText(/E-post må være gyldig/i)
    ).toBeInTheDocument();
  });
});
