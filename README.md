# CypressAngularTestesIntegracao
Exemplos de Teste de Integracao, utilizando Cypress E2E em um modelo de projeto de um blog feito em Angular

Projeto emula um blog completo baixar em:
[https://github.com/gothinkster/angular-realworld-example-app](https://github.com/gothinkster/angular-realworld-example-app)

Documentacao: [http:docs.cypress.io/plugins/](http:docs.cypress.io/plugins/)

instalar cypress somente para desenvolvimento
#### npm install cypress --save-dev

para verificar a versao 
#### npx cypress -v

desinstale protractor
#### npx uninstall --save-dev protractor
apague a pasta e2e
no package.json remova a linha "e2e":"ng e2e"

Run
#### npx cypress open

Obs: gerou erro ao tentar rodar The plugins file is missing or invalid.
Correção: basta mudar a estensao de .js para .ts do plugin/index.ts

rodar teste:
npx cypress run --spec ".\cypress\integration\examples\aula\aula_exemplo1.spec.js"


```
describe('Primeiro Teste', () => {
  it('Exemplos Cypress', () => {
    cy.visit('https://example.cypress.io')
    expect(true).to.equal(true)
  })
})
```

No cypress.json adicione configuracoes base:
```
{
  "baseUrl": "http://localhost:4200",
  "pageLoadTimeout": 30000,
  "defaultCommandTimeout": 30000,
  "viewportheight": 800,
  "viewportWidth": 500,
  "retries": 3
}

```

no navegador extensao Cypress Recorder se clicar Start Recording ele executa testes
qualquer manipulacao da pagina gera script cadastro.spec.js AUTOMATICO

### Exemplos de Testes:

criar cadastro.spec.js MANUAL: integration/examples/aula/cadastro.spec.ts

```
describe('Conduit Cadastro', () => {
  const usuario = 'usuario'+(new Date()).getTime()
  const senha = 'senha'+(new Date().getTime())
  it('Novo Usuario', () => {
    cy.visit('/register')
    cy.get('[formcontrolname=username]').type(usuario)
    cy.get('[formcontrolname=email]').type(usuario+'@email.com')
    cy.get('[formcontrolname=password]').type(senha)
    cy.get('btn').click()
    cy.contains('.nav-item:nth-child(4) > .nav-link', usuario)
        .should('be.visible')
  })

it('Usuario ja existe', () => {
    cy.visit('/register')
    cy.get('[formcontrolname=username]').type(usuario)
    cy.get('[formcontrolname=email]').type(usuario+'@email.com')
    cy.get('[formcontrolname=password]').type(senha)
    cy.get('btn').click()
    cy.location('pathname').should('equal', '/register')
    cy.get('.error-messages > li:nth-child(1)')
        .should('not.be.empty')
  })
})


```

Criar comands(pluggin) que ira facilitar importar pasta
support/commands.js

```
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/login')
  cy.url.should('include', '/login')
  cy.get('[formcontrolname=email]').type(username)
  cy.get('[formcontrolname=password]').type(password)
  cy.get('btn').click()
})
```

login.spect.js (usa o pluggin acima cy.login)
```
describe('Conduit Login', () => {
  it('Login Sucesso', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.get('.nav-item:nth-child(4) > .nav-link').click()
    cy.get('btn:nth-child(5)').click()
    cy.url().should('contain', '/settings')
  })

  it('Dados invalidos', () => {
    cy.login('usuario@inexistente.com', 'senhaerrada')
    cy.get('.error-message > li')
    .should('contain', 'email or password is invalid')
  })
})
```

profile.spect.ts
```
describe('Profile', () => {
  it('Editar Perfil', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('testecypress').click()
    cy.contains('Edit Profile Settings').click()
    cy.get('[formcontrolname="image"]').clear()
    cy.get('[formcontrolname="image"]')
      .type('https://thispersondoesnotexist.com/image')
    cy.get('[formcontrolname="password"]').type('testecypress')
    cy.contains('Update Settings').click()
  })
  
  it('Dados Invalidos', () => {
    cy.login('usuario@inexistente.com', 'senhaerrada')
    cy.get('.error-messages > li')
      .should('contais', 'email or password is invalid')
  })

})
```

feeds.spect.js

```
describe('Conduit Feed', () => {
  it('Ver Feeds', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.get('.nav-pills > .nav-item:nth-child(1) > .nav-link')
      .click();
    cy.get('.nav-pills > .nav-item:nth-child(2) > .nav-link')
      .click();
    cy.get('app-article-preview:nth-child(1) .btn').click();
  })
  
})
```

paginacao.spect.ts

```
describe('Paginacao', () => {
  it('Paginar', () => {
    cy.visit('/')
    cy.get('.page-item.active > a').contains('1')
    cy.get('.page-item:nth-child(2) > .page-link')
      .click();
    cy.get('.page-item.active > a').contains('2')
    cy.get('.page-item:nth-child(3) > .page-link')
      .click();
      cy.get('.page-item.active > a').contains('3')
  })

})
```

post.spec.js

```
describe('Post', () => {
  beforeEach(() => {
    cy.login('testecypress@testecypress.com', 'testecypress')
  })
  it('Novo', () => {
    cy.contains('New Article').click()
    cy.location('pathname').should('equal', '/editor')
    cy.get('[formcontrolname=title]').type('Cypress E2E')
    cy.get('[formcontrolname=description]').type('Ponta a Ponta')
    cy.get('[formcontrolname=body]').type('Agilidade, Qualidade')
    cy.contains('Published Article').click()
    cy.get('h1').contains('Cypress E2E')
  })

  it('Editar', () => {
    cy.contains('testecypress').click()
    cy.location('pathname').should('contains', '/profile')
    cy.get('.article-preview').get('h1').first().click()
    cy.contains('Edit Article').click()
    cy.get('[formcontrolname=body]').clear()
    cy.get('[formcontrolname=body]').type('Economia')
    cy.contains('Publish Article').click()
    cy.contains('Economia')
  })

})
```

tags.spect.js

```
describe('Tags', () => {
  it('Adicionar', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('testecypress').click()
    cy.location('pathname').should('contains', '/profile')
    cy.get('.article-preview').get('h1').first().click()
    cy.contains('Edit Article').click()
    cy.get('[formcontrolname="Enter tags"]').type('dungeons{enter}')
    cy.get('[formcontrolname="Enter tags"]').type('dragons{enter}')
    cy.contains('Published Article').click()
    cy.get('.tag-list').contains('dragons')
  })
})
```

comentario.spec.js

```
describe('Comentarios', () => {
  it('Escrever', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('Global Feed').click()
    cy.get('.preview-link').first().click()
    cy.get('.form-control').type('Sensacional')
    cy.get('.btn-primary').click()
    cy.contains('Sensacional').click()
  })
})

```
seguir.spec.js

```
describe('Seguir', () => {
  it('Seguir Usuario', () => {
    const usuario = 'usuario'+(new Date()).getTime();
    const senha = 'senha'+(new Date()).getTime();
    cy.visit('/register', { timeout: 10000 })
    cy.get('[formcontrolname=username]').type(usuario)
    cy.get('[formcontrolname=email]').type(usuario+'@email.com')
    cy.get('[formcontrolname=password]').type(senha)
    cy.get('.btn').click()
    cy.wait(10000)
    cy.visit('/profile/testecypress')
    cy.contains('Follow').click()
  })
})
```

logout.spec.ts

```
describe('Logout', () => {
  it('Logout via Perfil', () => {
    cy.login('testecypress@testecypress.com', 'testecypress')
    cy.contains('Settings').click()
    cy.url().should('include', '/settings')
    cy.get('./btn-outline-danger').click()
  })
})

```
