require("cypress-real-events");

// Commands customizados guardam fluxos repetidos e deixam os testes mais fáceis de estudar.
Cypress.Commands.add("loginAsDemoUser", ({
  email = "qa@exemplo.com",
  password = "Qa123456",
} = {}) => {
  cy.visit("/automation");
  cy.get("#qa-login-email").type(email);
  cy.get("#qa-login-password").type(password);
  cy.get("#qa-login-submit").click();
  cy.location("pathname").should("eq", "/automation/loja");
});

// Preenche o formulário atual para permitir testar cadastro válido, inválido e duplicado.
Cypress.Commands.add("fillRegistrationForm", ({
  name,
  email,
  password,
  confirmation = password,
}) => {
  cy.get("#qa-register-name").clear().type(name);
  cy.get("#qa-register-email").clear().type(email);
  cy.get("#qa-register-password").clear().type(password);
  cy.get("#qa-register-confirm-password").clear().type(confirmation);
});

// Usa um ID de produto para reaproveitar a mesma ação em diferentes cenários de carrinho.
Cypress.Commands.add("addProductToCart", (productId) => {
  cy.get(`#qa-add-${productId}`).click();
});

// Normaliza o espaço não separável usado pela moeda brasileira antes de comparar valores.
Cypress.Commands.add("expectPrice", (selector, expectedPrice) => {
  cy.get(selector).invoke("text").should((text) => {
    expect(text.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim())
      .to.equal(expectedPrice);
  });
});

// Intercepta o EmailJS para exercitar o envio sem disparar e-mails reais.
Cypress.Commands.add("stubEmailService", (alias) => {
  cy.intercept("POST", "**/api/v1.0/email/send", {
    statusCode: 200,
    body: { status: 200, text: "OK" },
  }).as(alias);
});

// Substitui a área de transferência do navegador por um stub controlado pelo teste.
Cypress.Commands.add("stubClipboard", () => cy.window().then((window) => {
  const writeText = cy.stub().resolves();
  Object.defineProperty(window.navigator, "clipboard", {
    configurable: true,
    value: { writeText },
  });
  return writeText;
}));

// Usa Tab até o controle esperado e falha explicitamente se ele não receber foco.
Cypress.Commands.add("tabTo", (selector) => {
  const tabUntilFocused = (attempt = 0) => cy.document().then((document) => {
    const target = document.querySelector(selector);
    if (!target) {
      throw new Error(`Não foi possível encontrar o controle para navegação por teclado: ${selector}`);
    }
    if (document.activeElement === target) {
      return;
    }
    if (attempt >= 100) {
      throw new Error(`O controle não recebeu foco após 100 teclas Tab: ${selector}`);
    }

    cy.realPress("Tab");
    return tabUntilFocused(attempt + 1);
  });

  return cy.get(selector).should("exist").then(() => tabUntilFocused());
});

// Aciona com Enter o controle que foi alcançado somente por navegação de teclado.
Cypress.Commands.add("activateByKeyboard", (selector) => {
  cy.tabTo(selector);
  cy.realPress("Enter");
});
