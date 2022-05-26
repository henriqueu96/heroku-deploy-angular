# Publicando projeto angular no Heroku com Github Actions

### Pré requisitos
Ter o node e o angular cli instalados, além de ter um repositório no github
e uma conta gratuita no Heroku.

## Passo a Passo

### Criar um projeto angular
Para iniciar, é necessário criar um projeto angular a partir do CLI
```
ng new
```
### Script Start
Como o Heroku não dá suporte direto ao angular, e sim ao node, então
fazemos o build com o angular CLI e usamos o node para distribuir
esse build.

Já com o projeto angular iniciado, vamos adicionar duas dependencias:
````
npm install express path --save
````

Além disso, é preciso criar um arquivo, na raiz do projeto, que inicie o serviço:
``service.js``
````
const express = require('express')
const path = require('path')

const app = express()
const appName = 'lista-compras'
app.use(express.static(`${__dirname}/dist/${appName}`))

app.get('/', (req, res) => {
  res.sendFile(path.join(`${__dirname}/dist/${appName}/index.html`))
});

console.log('App running')
app.listen(process.env.PORT || 8080);
````

O script start será o responsável por demonstrar ao Heroku 
como iniciar o App.
````
"build": "ng build --prod",
"start": "node server.js",
````

### Script test
Para que o deploy aconteça somente quando os testes passarem, temos que 
ajustar o script de testes para uma versão que rode uma unica vez os testes e
mostre o resultado. Além disso, podemos escolher um navegador mais rápido
e que utilize menos recurso, que se chama ChromeHeadless.
````
"test": "ng test --watch=false --browsers ChromeHeadless"
````
IMPORTANTE: Se o script de teste não for alterado, o github actions não vai parar o passo de teste,
consumindo com seu tempo de build com o Karma!

### Adicionando o Github Action
Para adicionar a action, é preciso criar o arquivo 
``.github/workflows/node.js.yml``
````
name: Node.js CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:

    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x]

    steps:
    - uses: actions/checkout@v3
    - name: Use Node.js ${{ matrix.node-version }}
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    - run: npm ci
    - run: npm run build
    - run: npm test
````
Criado esse arquivo, ao fazer o push para a branch main a action irá
aparecer lá na aba actions do github:  

![Imagem do github com a nova action](/.img/github-novo-build.png)

### Adicionando deploy no Heroku
