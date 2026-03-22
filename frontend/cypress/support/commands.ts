/// <reference types="cypress" />

// Custom command: login via API and set localStorage (fast, no UI)
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:8080/api/auth/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((res) => {
    if (res.status === 200) {
      window.localStorage.setItem('token', res.body.token);
      window.localStorage.setItem('user', JSON.stringify(res.body));
    }
  });
});

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      loginByApi(email: string, password: string): Chainable<void>;
    }
  }
}
