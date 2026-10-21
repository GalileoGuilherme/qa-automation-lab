describe("Exercícios da loja", () => {
  beforeEach(() => {
    cy.loginAsDemoUser();
  });

  it("Buscar um produto pelo nome", () => {
    // A busca textual deve manter o produto correspondente e ocultar os demais.
    cy.get("#qa-product-search").type("Fone Bluetooth");

    cy.get("#qa-product-fone-bluetooth").should("be.visible");
    cy.get("#qa-product-list > article").should("have.length", 1);
  });

  it("Busca sem resultados", () => {
    // Uma consulta sem correspondências deve apresentar o estado vazio do catálogo.
    cy.get("#qa-product-search").type("produto inexistente");

    cy.get("#qa-products-empty").should("be.visible");
  });

  it("Filtrar produtos por categoria", () => {
    // O filtro deve exibir produtos da categoria selecionada e ocultar outras categorias.
    cy.get("#qa-category-filter").select("Casa");

    cy.get("#qa-product-lampada-smart").should("be.visible");
    cy.get("#qa-product-list > article").should("have.length", 2);
  });

  it("Ordenar produtos por preço", () => {
    // Compara os primeiros cartões após ordenar do menor e do maior preço.
    cy.get("#qa-sort-products").select("price-ascending");
    cy.get("#qa-product-list > article")
      .first()
      .should("have.attr", "id", "qa-product-lampada-smart");
    cy.get("#qa-sort-products").select("price-descending");
    cy.get("#qa-product-list > article")
      .first()
      .should("have.attr", "id", "qa-product-teclado-mecanico");
  });

  it("Adicionar produto ao carrinho", () => {
    // O contador e a tabela devem refletir o produto recém-adicionado.
    cy.addProductToCart("fone-bluetooth");

    cy.get("#qa-cart-count").should("contain.text", "1 item");
    cy.get("#qa-cart-row-fone-bluetooth").should("be.visible");
    cy.get("#qa-store-feedback").should("contain.text", "adicionado ao carrinho");
  });

  it("Alterar quantidade no carrinho", () => {
    // Aumenta a quantidade e confere subtotal, total e contador atualizados.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-quantity-fone-bluetooth").type("{selectall}2");

    cy.get("#qa-cart-count").should("contain.text", "2 itens");
    cy.expectPrice("#qa-subtotal", "R$ 379,80");
    cy.expectPrice("#qa-total", "R$ 379,80");
  });

  it("Remover produto do carrinho", () => {
    // Remover o único item deve restaurar a mensagem de carrinho vazio.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-remove-fone-bluetooth").click();

    cy.get("#qa-cart-empty").should("be.visible");
    cy.get("#qa-cart-row-fone-bluetooth").should("not.exist");
  });

  it("Aplicar cupom válido", () => {
    // O cupom de demonstração aplica 10% de desconto ao subtotal.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-promo-code").type("CYPRESS10");
    cy.get("#qa-apply-promo").click();

    cy.expectPrice("#qa-discount", "R$ 18,99");
    cy.expectPrice("#qa-total", "R$ 170,91");
  });

  it("Aplicar cupom inválido", () => {
    // Um cupom desconhecido deve informar o erro sem alterar o desconto.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-promo-code").type("INVALIDO");
    cy.get("#qa-apply-promo").click();

    cy.get("#qa-store-feedback").should("contain.text", "Cupom inválido");
    cy.expectPrice("#qa-discount", "R$ 0,00");
  });

  it("Calcular entrega expressa", () => {
    // A entrega expressa soma R$ 15,00 ao valor total do carrinho.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-shipping-express").check();

    cy.expectPrice("#qa-shipping-cost", "R$ 15,00");
    cy.expectPrice("#qa-total", "R$ 204,90");
  });

  it("Finalizar pedido com carrinho vazio", () => {
    // O formulário válido não deve concluir a compra sem um item no carrinho.
    cy.get("#qa-checkout-address").type("Rua de Testes, 123");
    cy.get("#qa-terms").check();
    cy.get("#qa-checkout-submit").click();

    cy.get("#qa-store-feedback")
      .should("be.visible")
      .and("contain.text", "Adicione ao menos um produto");
    cy.get("#qa-order-confirmation").should("not.exist");
  });

  it("Validar campos obrigatórios do checkout", () => {
    // Com um produto, endereço e aceite são obrigatórios para submeter o pedido.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-checkout-submit").click();

    cy.get("#qa-checkout-address").should(($input) => {
      expect($input[0].validity.valid).to.be.false;
    });
    cy.get("#qa-terms").should("not.be.checked");
    cy.get("#qa-order-confirmation").should("not.exist");
  });

  it("Finalizar pedido com sucesso", () => {
    // O checkout preenchido deve mostrar confirmação e um identificador de pedido.
    cy.addProductToCart("fone-bluetooth");
    cy.get("#qa-checkout-address").type("Rua de Testes, 123");
    cy.get("#qa-terms").check();
    cy.get("#qa-checkout-submit").click();

    cy.get("#qa-order-confirmation").should("be.visible");
    cy.get("#qa-order-number").invoke("text").should("match", /^QA-\d+$/);
    cy.get("#qa-cart-empty").should("be.visible");
  });

  it("Encerrar sessão", () => {
    // Sair da loja deve limpar a sessão e retornar ao formulário de login.
    cy.get("#qa-logout-button").click();

    cy.location("pathname").should("eq", "/automation");
    cy.get("#qa-login-form").should("be.visible");
  });

  it("Navegar pela página usando somente o teclado", () => {
    // Reabre a página pública e navega pelos controles sem usar cliques de mouse.
    cy.visit("/automation");
    cy.activateByKeyboard("#qa-open-exercises");
    cy.get("#qa-exercise-dialog").should("be.visible");

    // Espaço marca uma caixa de seleção quando ela está focada.
    cy.tabTo("#qa-exercise-login-valid");
    cy.realPress("Space");
    cy.get("#qa-exercise-login-valid").should("be.checked");
    cy.activateByKeyboard("#qa-done-exercises");

    // O exercício concluído deve continuar marcado após recarregar a página.
    cy.reload();
    cy.activateByKeyboard("#qa-open-exercises");
    cy.get("#qa-exercise-login-valid").should("be.checked");
    cy.get("#qa-exercise-progress").should("contain.text", "1");

    // O diálogo de componentes também deve abrir e fechar por teclado.
    cy.activateByKeyboard("#qa-exercise-hint-login-valid");
    cy.get("#qa-component-dialog").should("be.visible");
    cy.get("#qa-component-name").should("contain.text", "Formulário de login");
    cy.activateByKeyboard("#qa-done-component-dialog");

    // Intercepta a sugestão para testar o envio sem disparar e-mail real.
    cy.stubEmailService("sendSuggestion");
    cy.activateByKeyboard("#qa-open-suggestion");
    cy.get("#qa-suggestion-dialog").should("be.visible");
    cy.get("#qa-suggestion-exercise-title").type("Testar ordenação do catálogo");
    cy.get("#qa-suggestion-details")
      .type("Ordenar os produtos pelo preço e conferir a sequência exibida.");
    cy.activateByKeyboard("#qa-submit-suggestion");
    cy.wait("@sendSuggestion");
    cy.get("#qa-suggestion-status")
      .should("be.visible")
      .and("contain.text", "Sugestão enviada");
    cy.activateByKeyboard("#qa-close-suggestion");
    cy.activateByKeyboard("#qa-done-exercises");

    // O formulário de feedback também deve ser acessível e enviar pelo teclado.
    cy.stubEmailService("sendFeedback");
    cy.activateByKeyboard("#qa-open-feedback");
    cy.get("#qa-feedback-dialog").should("be.visible");
    cy.get("#qa-feedback-message").type("O catálogo foi fácil de testar.");
    cy.activateByKeyboard("#qa-submit-feedback");
    cy.wait("@sendFeedback");
    cy.get("#qa-feedback-status")
      .should("be.visible")
      .and("contain.text", "Feedback enviado");
  });
});
