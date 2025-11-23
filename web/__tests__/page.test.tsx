import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '../app/page';

describe('Homepage', () => {
  it('should render without crashing', () => {
    render(<HomePage />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
  });

  it('should display hero heading with enterprise text', () => {
    render(<HomePage />);
    const heading = screen.getByRole('heading', { name: /ENTERPRISE.*ROUTING ENGINE/i });
    expect(heading).toBeInTheDocument();
  });

  it('should display system status indicator', () => {
    render(<HomePage />);
    const status = screen.getByText(/All Systems Operational/i);
    expect(status).toBeInTheDocument();
  });

  it('should contain navigation logo', () => {
    render(<HomePage />);
    const logo = screen.getByAltText(/Rivoct/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/assets/logo.svg');
  });

  it('should contain login link', () => {
    render(<HomePage />);
    const loginLink = screen.getByRole('link', { name: /LOGIN/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should contain CTA button for console access', () => {
    render(<HomePage />);
    const ctaButton = screen.getByRole('link', { name: /Get API Key/i });
    expect(ctaButton).toBeInTheDocument();
    expect(ctaButton).toHaveAttribute('href', '/login');
  });
});
