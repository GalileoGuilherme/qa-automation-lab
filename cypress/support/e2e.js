Cypress.Commands.add("loginAsDemoUser", () => {
  cy.visit("/automation");
  cy.get("#qa-login-email").type("qa@exemplo.com");
  cy.get("#qa-login-password").type("Qa123456");
  cy.get("#qa-login-submit").click();
  cy.location("pathname").should("eq", "/automation/loja");
});
