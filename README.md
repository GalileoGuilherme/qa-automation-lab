# QA Automation Lab

Projeto de estudos de automação de testes E2E com Cypress. Os testes exercitam a loja fictícia disponível na página pública [Automação QA](https://portfolio-omega-six-18.vercel.app/automation).

O projeto foi criado para praticar leitura de requisitos, seletores estáveis, comandos customizados, validações, interação por teclado, interceptação de requisições e organização de testes. Os títulos dos 25 testes correspondem exatamente aos títulos da lista de exercícios da página.

> **Atenção:** a loja é demonstrativa. As contas e os pedidos são fictícios e não representam um sistema de compra real.

## Índice

- [O que você vai encontrar](#o-que-você-vai-encontrar)
- [Pré-requisitos](#pré-requisitos)
- [Criar um projeto a partir do template](#criar-um-projeto-a-partir-do-template)
- [Instalação](#instalação)
- [Como executar](#como-executar)
- [Configuração da URL](#configuração-da-url)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Comandos customizados](#comandos-customizados)
- [O que cada teste valida](#o-que-cada-teste-valida)
- [Como estudar e contribuir](#como-estudar-e-contribuir)
- [Observações importantes](#observações-importantes)

## O que você vai encontrar

- **25 testes E2E** organizados em dois arquivos, seguindo a lista de exercícios da página.
- Fluxos de login, cadastro, busca, filtros, carrinho, descontos, entrega e checkout.
- Interações de acessibilidade com eventos reais de teclado.
- Comandos Cypress reutilizáveis e comentados para demonstrar como reduzir repetição.
- Interceptação do serviço de e-mail e substituição da área de transferência para que os testes não dependam desses serviços externos.

## Pré-requisitos

- Node.js 18 ou superior.
- npm, instalado com o Node.js.
- Google Chrome para executar os testes com `cypress-real-events` usando o comando `cy:run:chrome`.

O Cypress também pode executar a suíte no Electron empacotado com ele usando `cy:run`. O Electron está marcado pelo Cypress como navegador descontinuado; para os cenários de eventos reais de teclado, prefira o Chrome.

## Criar um projeto a partir do template

1. Acesse o repositório [QA Automation Lab](https://github.com/GalileoGuilherme/qa-automation-lab) no GitHub.
2. Clique em **Use this template** e selecione **Create a new repository**.
3. Escolha o proprietário, defina o nome e a visibilidade do novo repositório e clique em **Create repository**.
4. Clone o repositório que acabou de criar — não o repositório do template:

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
cd SEU-REPOSITORIO
```

Substitua `SEU-USUARIO` e `SEU-REPOSITORIO` pelos valores escolhidos no GitHub. Depois, instale as dependências conforme a próxima seção.

## Instalação

Na pasta do repositório criado a partir do template, instale as dependências registradas no lockfile:

```bash
npm ci
```

Use `npm install` quando precisar atualizar ou adicionar dependências:

```bash
npm install
```

## Como executar

### Abrir o Cypress interativo

```bash
npm run cy:open
```

Na janela do Cypress, escolha **E2E Testing**, selecione um navegador e clique no arquivo de teste que deseja estudar.
As requisições interceptadas aparecem no painel **Routes** e no registro de comandos. Clique em um comando `wait @alias` para inspecionar método, URL e resposta da chamada.

### Executar todos os testes sem interface

```bash
npm run cy:run
```

O Cypress executa todos os arquivos `cypress/e2e/**/*.cy.js` no Electron incluído na instalação.

### Executar com Google Chrome

Com o Chrome instalado:

```bash
npm run cy:run:chrome
```

Esse comando é recomendado para os testes de teclado, pois o `cypress-real-events` envia eventos nativos pelo Chrome DevTools Protocol.

### Executar somente um arquivo

```bash
npm run cy:run -- --spec "cypress/e2e/authentication.cy.js"
npm run cy:run -- --spec "cypress/e2e/store.cy.js"
```

### Executar um teste pelo nome

O Cypress aceita `--env grep` apenas quando um plugin de seleção por nome está instalado. Este projeto não adiciona esse plugin: para estudar um cenário isolado, abra a interface com `cy:open` e selecione o teste desejado.

## Configuração da URL

Por padrão, os testes usam:

```text
https://portfolio-omega-six-18.vercel.app
```

Os arquivos de teste visitam as rotas relativas `/automation`, `/automation/cadastro` e `/automation/loja`.

Para apontar os testes para outro ambiente, configure `CYPRESS_BASE_URL` antes de executar.

PowerShell:

```powershell
$env:CYPRESS_BASE_URL = "http://localhost:3001"
npm run cy:run
```

Prompt de Comando:

```cmd
set CYPRESS_BASE_URL=http://localhost:3001
npm run cy:run
```

Para voltar ao endereço padrão, feche o terminal ou remova a variável da sessão:

```powershell
Remove-Item Env:CYPRESS_BASE_URL
```

Também é possível criar um arquivo `.env` local para guardar configurações pessoais. Arquivos `.env` não são versionados; use `.env.example` como referência e não coloque tokens, senhas reais ou outros segredos no repositório.

## Estrutura do projeto

```text
seu-repositorio/
├── cypress/
│   ├── e2e/
│   │   ├── authentication.cy.js  # Login, cadastro e exercícios de autenticação
│   │   └── store.cy.js           # Catálogo, carrinho, checkout e teclado
│   └── support/
│       └── e2e.js                # Registro e implementação dos comandos customizados
├── .env.example                 # Exemplo da URL base
├── cypress.config.js            # Configuração do Cypress
├── package.json                 # Scripts e dependências
└── package-lock.json            # Versões resolvidas das dependências
```

## Comandos customizados

**Sim, os comandos customizados já estão implementados** em `cypress/support/e2e.js`. O Cypress carrega esse arquivo antes dos testes por meio de `supportFile` em `cypress.config.js`.

Comandos customizados agrupam ações repetidas em uma API legível. Eles não substituem as asserções específicas de cada cenário: cada teste ainda precisa explicar e validar seu próprio resultado.

### `cy.loginAsDemoUser(options)`

Abre a página de login, preenche as credenciais e verifica que a navegação chegou à loja.

```js
cy.loginAsDemoUser();
cy.loginAsDemoUser({ email: "qa@exemplo.com", password: "LabQA!Run-7kV2pX9m" });
```

Se nenhum argumento for fornecido, usa a conta fictícia padrão da página. A senha é apenas uma credencial de demonstração, não uma senha pessoal.

### `cy.fillRegistrationForm(options)`

Preenche nome, e-mail, senha e confirmação. A confirmação usa a senha informada quando `confirmation` não é fornecida.

```js
cy.fillRegistrationForm({
  name: "Pessoa Teste",
  email: "pessoa.teste@example.com",
  password: "TesteQA123",
});

// Também permite preencher uma confirmação diferente para testar a validação.
cy.fillRegistrationForm({
  name: "Pessoa Teste",
  email: "pessoa.teste@example.com",
  password: "TesteQA123",
  confirmation: "SenhaDiferente",
});
```

### `cy.addProductToCart(productId)`

Adiciona um produto usando o sufixo do ID estável do botão. Por exemplo, `"fone-bluetooth"` seleciona `#qa-add-fone-bluetooth`.

```js
cy.addProductToCart("fone-bluetooth");
```

### `cy.expectPrice(selector, expectedPrice)`

Lê o texto de um elemento de preço, normaliza espaços — inclusive o espaço não separável usado na formatação — e compara o resultado esperado.

```js
cy.expectPrice("#qa-total", "R$ 170,91");
```

### `cy.stubEmailService(alias)`

Intercepta a chamada HTTP do EmailJS e devolve uma resposta de sucesso simulada. Assim, é possível testar feedback e sugestões sem enviar e-mails de verdade.
No Cypress interativo, a rota aparece no painel **Routes**; os testes também validam método, URL e status da resposta após `cy.wait("@alias")`.

```js
cy.stubEmailService("sendFeedback");
// Preencher e enviar o formulário...
cy.wait("@sendFeedback").then(({ request, response }) => {
  expect(request.method).to.equal("POST");
  expect(request.url).to.include("/api/v1.0/email/send");
  expect(response.statusCode).to.equal(200);
});
```

Os fluxos de login e cadastro da aplicação demonstrativa são mantidos em memória no navegador, sem uma chamada HTTP de autenticação para interceptar.

### `cy.stubClipboard()`

Substitui `navigator.clipboard.writeText` por um stub do Cypress. O comando retorna esse stub para que o teste confirme qual valor teria sido copiado, sem depender da permissão de clipboard do navegador.

```js
cy.stubClipboard().then((writeText) => {
  cy.get("#qa-copy-email").click();
  cy.wrap(writeText).should("have.been.calledWith", "qa@exemplo.com");
});
```

### `cy.tabTo(selector)`

Envia teclas Tab reais até o elemento indicado receber foco. O comando falha com uma mensagem clara se o elemento não existir ou não receber foco após 100 tentativas.

```js
cy.tabTo("#qa-open-exercises");
```

### `cy.activateByKeyboard(selector)`

Usa `cy.tabTo()` para alcançar um controle e o ativa com uma tecla Enter real. Os eventos nativos são fornecidos por `cypress-real-events`.

```js
cy.activateByKeyboard("#qa-open-exercises");
cy.get("#qa-exercise-dialog").should("be.visible");
```

Para marcar uma caixa de seleção com teclado, o teste usa a mesma navegação e envia Espaço:

```js
cy.tabTo("#qa-exercise-login-valid");
cy.realPress("Space");
cy.get("#qa-exercise-login-valid").should("be.checked");
```

## O que cada teste valida

Os nomes abaixo são mantidos iguais aos exercícios exibidos em **Sugestões de exercícios** na página de prática.

### `cypress/e2e/authentication.cy.js`

1. **Login com credenciais válidas** — entra com a conta de demonstração e confirma que a loja foi aberta.
2. **Login com credenciais inválidas** — verifica a mensagem de erro e o estado `aria-invalid` da senha.
3. **Validação dos campos obrigatórios do login** — tenta enviar o formulário vazio e confere a validação nativa dos campos.
4. **Copiar e-mail de demonstração** — confirma o valor enviado à API de clipboard e a mensagem apresentada.
5. **Copiar senha de demonstração** — confirma a cópia simulada da senha e o feedback da página.
6. **Cadastrar um novo usuário** — cria uma conta fictícia e confirma o redirecionamento automático para a loja já autenticada.
7. **Cadastro com senhas diferentes** — valida o erro quando a confirmação não corresponde à senha.
8. **Cadastro com e-mail já utilizado** — verifica a mensagem para um endereço já cadastrado.
9. **Entrar com usuário cadastrado** — cria uma conta, encerra a sessão automática e valida a entrada com as credenciais recém-cadastradas.
10. **Acessar loja sem estar autenticado** — confirma que uma visita direta à área protegida redireciona para o login.

### `cypress/e2e/store.cy.js`

11. **Buscar um produto pelo nome** — pesquisa pelo nome e verifica o resultado correspondente.
12. **Busca sem resultados** — confirma a exibição do estado vazio para uma busca sem correspondências.
13. **Filtrar produtos por categoria** — seleciona uma categoria e verifica os produtos visíveis.
14. **Ordenar produtos por preço** — confere o primeiro cartão em ordem crescente e decrescente.
15. **Adicionar produto ao carrinho** — verifica contador, linha do produto e mensagem de confirmação.
16. **Alterar quantidade no carrinho** — atualiza quantidade, subtotal e total.
17. **Remover produto do carrinho** — remove o único item e confirma o estado vazio.
18. **Aplicar cupom válido** — aplica `CYPRESS10` e verifica o desconto de 10% e o total.
19. **Aplicar cupom inválido** — verifica a mensagem de cupom inválido e que nenhum desconto foi aplicado.
20. **Calcular entrega expressa** — confirma o acréscimo de R$ 15,00 e o novo total.
21. **Finalizar pedido com carrinho vazio** — verifica que o botão de confirmação permanece desativado sem produtos.
22. **Validar campos obrigatórios do checkout** — com um produto no carrinho, confirma que o botão permanece desativado enquanto endereço e aceite estão pendentes.
23. **Finalizar pedido com sucesso** — preenche o checkout e valida a confirmação e o número do pedido.
24. **Encerrar sessão** — sai da loja e confirma o retorno à página de login.
25. **Navegar pela página usando somente o teclado** — usa Tab, Enter e Espaço para navegar pelos controles e diálogos; também verifica progresso, feedback e sugestão sem enviar e-mails reais.

Cada teste contém comentários próximos às ações para explicar o objetivo do cenário. Eles são um ponto de partida para estudar Cypress: tente prever o resultado de cada comando, execute o teste e compare a previsão com as asserções.

## Como estudar e contribuir

1. Abra na página de prática a lista **Sugestões de exercícios** e escolha um cenário.
2. Localize os controles e seus IDs no DevTools do navegador antes de olhar a dica do exercício.
3. Encontre o teste com o mesmo título em `cypress/e2e/`.
4. Leia os comentários e as asserções; depois execute apenas o spec com `--spec` ou abra-o no Cypress interativo.
5. Faça uma alteração pequena no teste e execute-o novamente.
6. Ao criar um teste para um exercício, use o título exatamente como está na página e inclua comentários que expliquem a intenção das ações e as validações.
7. Antes de compartilhar as alterações, execute a suíte completa com `npm run cy:run` ou, para eventos reais de teclado, `npm run cy:run:chrome`.

Os seletores dos testes usam IDs estáveis fornecidos pela página de prática. O objetivo dos exercícios é aprender a localizar e validar os elementos — não alterar a aplicação testada.

## Observações importantes

- A aplicação de prática é pública e pode mudar. Se um teste falhar, verifique primeiro a página e seus IDs no DevTools antes de alterar a asserção.
- Os dados de cadastro e o carrinho são demonstrativos e ficam na memória da aplicação. Não os trate como dados persistentes de uma conta real.
- Os testes de feedback e sugestão interceptam `POST **/api/v1.0/email/send`; eles verificam o fluxo da interface, não a entrega de e-mail.
- `cypress-real-events` depende de um navegador Chromium para emitir eventos nativos; por isso, os testes de teclado devem ser executados preferencialmente no Chrome.
- Capturas de falha e vídeos do Cypress não são versionados.
