describe("Exercícios de autenticação", () => {
  it("Login com credenciais válidas", () => {
    // Confirma que as credenciais de demonstração abrem a área protegida da loja.
    cy.loginAsDemoUser();

    cy.get("#qa-store-user").should("contain.text", "qa@exemplo.com");
    cy.get("#qa-products-section").should("be.visible");
  });

  it("Login com credenciais inválidas", () => {
    // Credenciais incorretas devem exibir um erro e marcar a senha como inválida.
    cy.visit("/automation");
    cy.get("#qa-login-email").type("qa@exemplo.com");
    cy.get("#qa-login-password").type("senha-incorreta");
    cy.get("#qa-login-submit").click();

    cy.get("#qa-login-error")
      .should("be.visible")
      .and("contain.text", "E-mail ou senha inválidos");
    cy.get("#qa-login-password").should("have.attr", "aria-invalid", "true");
  });

  it("Validação dos campos obrigatórios do login", () => {
    // A validação nativa do navegador impede o envio sem os campos obrigatórios.
    cy.visit("/automation");
    cy.get("#qa-login-submit").click();

    cy.get("#qa-login-email").should(($input) => {
      expect($input[0].validity.valid).to.be.false;
    });
    cy.get("#qa-login-password").should(($input) => {
      expect($input[0].validity.valid).to.be.false;
    });
  });

  it("Copiar e-mail de demonstração", () => {
    // O stub permite validar a cópia sem depender da permissão real do navegador.
    cy.visit("/automation");
    cy.stubClipboard().then((writeText) => {
      cy.get("#qa-copy-email").click();

      cy.wrap(writeText).should("have.been.calledWith", "qa@exemplo.com");
      cy.get("#qa-copy-feedback")
        .should("contain.text", "E-mail copiado para a área de transferência");
    });
  });

  it("Copiar senha de demonstração", () => {
    // A senha também deve ser enviada à API de clipboard e confirmada na interface.
    cy.visit("/automation");
    cy.stubClipboard().then((writeText) => {
      cy.get("#qa-copy-password").click();

      cy.wrap(writeText).should("have.been.calledWith", "Qa123456");
      cy.get("#qa-copy-feedback")
        .should("contain.text", "copiado para a área de transferência");
    });
  });

  it("Cadastrar um novo usuário", () => {
    // O cadastro autentica a conta e redireciona diretamente para a loja.
    cy.visit("/automation/cadastro");
    cy.fillRegistrationForm({
      name: "Pessoa Teste",
      email: "pessoa.teste@example.com",
      password: "TesteQA123",
    });
    cy.get("#qa-register-submit").click();
    cy.location("pathname").should("eq", "/automation/loja");
    cy.get("#qa-store-user").should("contain.text", "pessoa.teste@example.com");
  });

  it("Cadastro com senhas diferentes", () => {
    // O formulário deve rejeitar a conta quando a confirmação diverge da senha.
    cy.visit("/automation/cadastro");
    cy.fillRegistrationForm({
      name: "Pessoa Teste",
      email: "outra.pessoa@example.com",
      password: "TesteQA123",
      confirmation: "SenhaDiferente",
    });
    cy.get("#qa-register-submit").click();

    cy.get("#qa-registration-error")
      .should("be.visible")
      .and("contain.text", "As senhas não coincidem");
  });

  it("Cadastro com e-mail já utilizado", () => {
    // O e-mail fixo da conta demo já existe e deve ser rejeitado como duplicado.
    cy.visit("/automation/cadastro");
    cy.fillRegistrationForm({
      name: "Pessoa Teste",
      email: "qa@exemplo.com",
      password: "TesteQA123",
    });
    cy.get("#qa-register-submit").click();

    cy.get("#qa-registration-error")
      .should("be.visible")
      .and("contain.text", "Já existe um usuário");
  });

  it("Entrar com usuário cadastrado", () => {
    // Cria a conta, encerra a sessão automática e autentica com as credenciais salvas.
    cy.visit("/automation/cadastro");
    cy.fillRegistrationForm({
      name: "Pessoa Cadastrada",
      email: "nova.conta@example.com",
      password: "NovaConta123",
    });
    cy.get("#qa-register-submit").click();
    cy.location("pathname").should("eq", "/automation/loja");
    cy.get("#qa-logout-button").click();
    cy.location("pathname").should("eq", "/automation");
    cy.get("#qa-login-form").should("be.visible");

    cy.get("#qa-login-email").type("nova.conta@example.com");
    cy.get("#qa-login-password").type("NovaConta123");
    cy.get("#qa-login-submit").click();

    cy.location("pathname").should("eq", "/automation/loja");
    cy.get("#qa-store-user").should("contain.text", "nova.conta@example.com");
  });

  it("Acessar loja sem estar autenticado", () => {
    // Uma sessão anônima deve voltar ao formulário de login ao acessar a loja.
    cy.visit("/automation/loja");

    cy.location("pathname").should("eq", "/automation");
    cy.get("#qa-login-form").should("be.visible");
  });

});
