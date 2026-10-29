/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    /**
     * Efetua login na aplicação com a conta de demonstração ou credenciais fornecidas.
     * @example cy.loginAsDemoUser()
     * @example cy.loginAsDemoUser({ email: 'user@example.com', password: 'secretPassword' })
     */
    loginAsDemoUser(options?: { email?: string; password?: string }): Chainable<void>;

    /**
     * Preenche os campos do formulário de cadastro de usuário.
     * @example cy.fillRegistrationForm({ name: 'Nome', email: 'email@ex.com', password: '123' })
     */
    fillRegistrationForm(options: {
      name: string;
      email: string;
      password: string;
      confirmation?: string;
    }): Chainable<void>;

    /**
     * Adiciona um produto ao carrinho pelo ID base (ex: 'fone-bluetooth').
     * @example cy.addProductToCart('fone-bluetooth')
     */
    addProductToCart(productId: string): Chainable<void>;

    /**
     * Valida o preço exibido em um elemento, normalizando espaços não separáveis.
     * @example cy.expectPrice('#qa-total', 'R$ 170,91')
     */
    expectPrice(selector: string, expectedPrice: string): Chainable<void>;

    /**
     * Intercepta a chamada à API do EmailJS retornando sucesso sem disparar e-mails reais.
     * @example cy.stubEmailService('sendEmail')
     */
    stubEmailService(alias: string): Chainable<void>;

    /**
     * Cria um stub para navigator.clipboard.writeText e retorna a função espiã.
     * @example cy.stubClipboard().then((writeText) => { ... })
     */
    stubClipboard(): Chainable<any>;

    /**
     * Navega via tecla Tab até que o elemento especificado receba foco ativo.
     * @example cy.tabTo('#qa-open-exercises')
     */
    tabTo(selector: string): Chainable<void>;

    /**
     * Navega com Tab até o elemento e o aciona com tecla Enter real.
     * @example cy.activateByKeyboard('#qa-open-exercises')
     */
    activateByKeyboard(selector: string): Chainable<void>;
  }
}

