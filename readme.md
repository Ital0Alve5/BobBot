# Bob

## Utilização

    Antes de tudo, rodar o comando 
    ```node 
    npm install
    ``` para instalar as dependências.
 
    Para executar o programa você precisa apenas utilizar o comando "npm run bob" no terminal.
    ```node
    npm run bob
    ```

## Possíveis imprevistos

    É comum que em primeiros acessos, após alguma mudança no código ou interrupções abruptas do programa, 
    o redirecionamento não funcione e o robô não consiga ir adiante parando na tela logo após o login na plataforma. 
    É um bug no puppeteer. Este problema é resolvido simplesmente dando F5.

    -Caso apareça um erro do tipo:
        ```bash
    Error: Could not find expected browser (chrome) locally. Run `npm install` to download the correct Chromium revision (884014)
    ```
    rode o comando:
    ```node
    node node_modules/puppeteer/install.js
    ```
    e tente novamente.
    
## Limitações:

    -Este programa foi desenvolvido para não depender da API do BobCat, já que não temos acesso. Então, ele só consegue extrair 
    informações que podem ser conseguidas sem requisição à API. Segue as informações que este programa consegue extrair: 
        Tipo de máquina;
        Grupo da máquina;
        Modelo da máquina;
        Número de série da máquina;
        Número de série reduzido da máquina;
        Grupo do Produto.
