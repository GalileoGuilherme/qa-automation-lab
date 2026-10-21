describe("Exercícios, feedback e sugestões", () => {
  beforeEach(() => {
    cy.visit("/automation");
  });

  it("abre e fecha a janela de componentes de um exercício", () => {
    cy.get("#qa-open-exercises").click();
    cy.get("#qa-exercise-hint-login-valid").click();

    cy.get("#qa-component-dialog").should("be.visible");
    cy.get("#qa-component-name").should("contain.text", "Formulário de login");
    cy.get("#qa-component-selector-list").should("contain.text", "#qa-login-email");
    cy.get("#qa-done-component-dialog").click();
    cy.get("#qa-exercise-dialog").should("be.visible");
  });

  it("abre a janela de feedback", () => {
    cy.get("#qa-open-feedback").click();

    cy.get("#qa-feedback-dialog").should("be.visible");
    cy.get("#qa-feedback-message").should("be.visible");
  });

  it("envia feedback usando uma resposta simulada do serviço de e-mail", () => {
    cy.intercept("POST", "**/api/v1.0/email/send", {
      statusCode: 200,
      body: { status: 200, text: "OK" },
    }).as("sendFeedback");

    cy.get("#qa-open-feedback").click();
    cy.get("#qa-feedback-message").type("O catálogo foi fácil de testar.");
    cy.get("#qa-submit-feedback").click();

    cy.wait("@sendFeedback");
    cy.get("#qa-feedback-status")
      .should("be.visible")
      .and("contain.text", "Feedback enviado");
  });

  it("envia sugestão de exercício sem disparar e-mail real durante o teste", () => {
    cy.intercept("POST", "**/api/v1.0/email/send", {
      statusCode: 200,
      body: { status: 200, text: "OK" },
    }).as("sendSuggestion");

    cy.get("#qa-open-exercises").click();
    cy.get("#qa-open-suggestion").click();
    cy.get("#qa-suggestion-exercise-title").type("Testar ordenação do catálogo");
    cy.get("#qa-suggestion-details").type("Ordenar os produtos pelo preço e conferir a sequência exibida.");
    cy.get("#qa-submit-suggestion").click();

    cy.wait("@sendSuggestion");
    cy.get("#qa-suggestion-status")
      .should("be.visible")
      .and("contain.text", "Sugestão enviada");
  });
});
