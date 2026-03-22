/// <reference types="cypress" />

describe('Login Page', () => {
  beforeEach(() => {
    // Clear any previous session
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('displays the login form', () => {
    cy.contains('Welcome back').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button[type="submit"]').contains('Sign in').should('be.visible');
  });

  it('shows a link to the register page', () => {
    cy.contains('Create one').should('have.attr', 'href', '/register');
  });

  it('shows validation errors when submitting empty form', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Valid email required').should('be.visible');
    cy.contains('Password required').should('be.visible');
  });

  it('shows error toast on wrong credentials', () => {
    // Use 400 instead of 401 — the axios interceptor redirects to /login on 401
    // which prevents the toast from ever showing
    cy.intercept('POST', '**/auth/login', {
      statusCode: 400,
      body: { message: 'Invalid email or password' },
    }).as('loginFail');

    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Invalid email or password').should('be.visible');
  });

  it('redirects to /dashboard on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        type: 'Bearer',
        userId: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'ROLE_FREELANCER',
      },
    }).as('loginSuccess');

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.url().should('include', '/dashboard');
  });

  it('stores token in localStorage on successful login', () => {
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        type: 'Bearer',
        userId: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'ROLE_FREELANCER',
      },
    }).as('loginSuccess');

    cy.get('input[type="email"]').type('john@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token');
    });
  });

  it('redirects already authenticated users away from /login', () => {
    // Pre-set auth in localStorage
    window.localStorage.setItem('token', 'fake-jwt-token');
    window.localStorage.setItem(
      'user',
      JSON.stringify({
        token: 'fake-jwt-token',
        type: 'Bearer',
        userId: 1,
        fullName: 'John Doe',
        email: 'john@example.com',
        role: 'ROLE_FREELANCER',
      })
    );

    cy.intercept('GET', '/api/dashboard/freelancer/*', { body: {} }).as('dashboard');
    cy.visit('/login');
    cy.url().should('include', '/dashboard');
  });
});
