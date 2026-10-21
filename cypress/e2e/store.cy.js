describe("Loja de demonstração", () => {
  beforeEach(() => {
    cy.loginAsDemoUser();
  });

  it("filtra produtos pela busca", () => {
    cy.get("#qa-product-search").type("Fone Bluetooth");

    cy.get("#qa-product-fone-bluetooth").should("be.visible");
    cy.get("#qa-product-teclado-mecanico").should("not.exist");
  });

  it("filtra produtos por categoria", () => {
    cy.get("#qa-category-filter").select("Casa");

    cy.get("#qa-product-lampada-smart").should("be.visible");
    cy.get("#qa-product-garrafa-termica").should("not.exist");
  });

  it("mostra estado vazio para uma pesquisa sem resultados", () => {
    cy.get("#qa-product-search").type("produto inexistente");

    cy.get("#qa-products-empty").should("be.visible");
  });

  it("adiciona produto, atualiza quantidade e calcula o total", () => {
    cy.get("#qa-add-fone-bluetooth").click();
    cy.get("#qa-cart-count").should("contain.text", "1 item");
    cy.get("#qa-quantity-fone-bluetooth").type("{selectall}2");
    cy.get("#qa-subtotal").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 379,80");
    });
    cy.get("#qa-total").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 379,80");
    });
  });

  it("aplica o cupom CYPRESS10 e calcula o desconto", () => {
    cy.get("#qa-add-fone-bluetooth").click();
    cy.get("#qa-promo-code").type("CYPRESS10");
    cy.get("#qa-apply-promo").click();

    cy.get("#qa-discount").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 18,99");
    });
    cy.get("#qa-total").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 170,91");
    });
  });

  it("informa quando o cupom é inválido", () => {
    cy.get("#qa-add-fone-bluetooth").click();
    cy.get("#qa-promo-code").type("INVALIDO");
    cy.get("#qa-apply-promo").click();

    cy.get("#qa-store-feedback").should("contain.text", "Cupom inválido");
    cy.get("#qa-discount").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 0,00");
    });
  });

  it("adiciona o custo da entrega expressa ao total", () => {
    cy.get("#qa-add-fone-bluetooth").click();
    cy.get("#qa-shipping-express").check();

    cy.get("#qa-shipping-cost").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 15,00");
    });
    cy.get("#qa-total").invoke("text").should((text) => {
      expect(text.replace(/\u00a0/g, " ")).to.equal("R$ 204,90");
    });
  });

  it("finaliza um pedido demonstrativo", () => {
    cy.get("#qa-add-fone-bluetooth").click();
    cy.get("#qa-checkout-address").type("Rua de Testes, 123");
    cy.get("#qa-terms").check();
    cy.get("#qa-checkout-submit").click();

    cy.get("#qa-order-confirmation").should("be.visible");
    cy.get("#qa-order-number").invoke("text").should("match", /^QA-\d+$/);
    cy.get("#qa-cart-empty").should("be.visible");
  });

  it("encerra a sessão e volta para o login", () => {
    cy.get("#qa-logout-button").click();

    cy.location("pathname").should("eq", "/automation");
    cy.get("#qa-login-form").should("be.visible");
  });
});
