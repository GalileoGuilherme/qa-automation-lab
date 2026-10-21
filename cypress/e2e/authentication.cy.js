describe("Autenticação e cadastro", () => {
  it("redireciona para o login ao abrir a loja sem sessão", () => {
    cy.visit("/automation/loja");

    cy.location("pathname").should("eq", "/automation");
    cy.get("#qa-login-form").should("be.visible");
  });

  it("mostra erro ao usar credenciais inválidas", () => {
    cy.visit("/automation");
    cy.get("#qa-login-email").type("qa@exemplo.com");
    cy.get("#qa-login-password").type("senha-incorreta");
    cy.get("#qa-login-submit").click();

    cy.get("#qa-login-error")
      .should("be.visible")
      .and("contain.text", "E-mail ou senha inválidos");
    cy.get("#qa-login-password").should("have.attr", "aria-invalid", "true");
  });

  it("cadastra um usuário e permite entrar com a nova conta", () => {
    cy.visit("/automation/cadastro");
    cy.get("#qa-register-name").type("Pessoa Teste");
    cy.get("#qa-register-email").type("pessoa.teste@example.com");
    cy.get("#qa-register-password").type("TesteQA123");
    cy.get("#qa-register-confirm-password").type("TesteQA123");
    cy.get("#qa-register-submit").click();
    cy.get("#qa-registration-success").should("be.visible");
    cy.get("#qa-registration-login").click();

    cy.get("#qa-login-email").type("pessoa.teste@example.com");
    cy.get("#qa-login-password").type("TesteQA123");
    cy.get("#qa-login-submit").click();
    cy.location("pathname").should("eq", "/automation/loja");
    cy.get("#qa-store-user").should("contain.text", "pessoa.teste@example.com");
  });

  it("valida divergência entre senha e confirmação no cadastro", () => {
    cy.visit("/automation/cadastro");
    cy.get("#qa-register-name").type("Pessoa Teste");
    cy.get("#qa-register-email").type("outra.pessoa@example.com");
    cy.get("#qa-register-password").type("TesteQA123");
    cy.get("#qa-register-confirm-password").type("SenhaDiferente");
    cy.get("#qa-register-submit").click();

    cy.get("#qa-registration-error")
      .should("be.visible")
      .and("contain.text", "As senhas não coincidem");
  });

  it("marca exercícios como concluídos e mantém o progresso ao recarregar", () => {
    cy.visit("/automation");
    cy.get("#qa-open-exercises").click();
    cy.get("#qa-exercise-login-valid").check();
    cy.get("#qa-done-exercises").click();

    cy.reload();
    cy.get("#qa-open-exercises").click();
    cy.get("#qa-exercise-login-valid").should("be.checked");
    cy.get("#qa-exercise-progress").should("contain.text", "1");
  });
});
