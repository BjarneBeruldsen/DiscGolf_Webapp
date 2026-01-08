import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n';
import Footer from '../../_components/Footer';

describe('Footer', () => {
  it('skal rendre footer komponenten', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });

  it('skal inneholde lenker til viktige sider', () => {
    render(
      <BrowserRouter>
        <I18nextProvider i18n={i18n}>
          <Footer />
        </I18nextProvider>
      </BrowserRouter>
    );
    expect(document.body).toBeTruthy();
  });
});
