//Author: Laurent Zogaj
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import KontaktOss from '../../_components/KontaktOss';

global.fetch = vi.fn();

describe('KontaktOss', () => {
  it('skal rendre kontakt oss komponenten', () => {
    render(<KontaktOss />);
    expect(document.body).toBeTruthy();
  });
});
