# Bob

remote

## Utilização

    Para executar o programa você precisa apenas utilizar o comando "npm run bob" no terminal.
    ```node
    npm run bob
    ```

## Possíveis imprevistos

    É comum que em primeiros acessos, após alguma mudança no código ou interrupções abruptas do programa, o redirecionamento não funcione e o robô não consiga ir adiante parando na tela logo após o login na plataforma. É um bug no puppeteer. Este problema é resolvido simplesmente dando F5.

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

    -Infelizmente, este programa não consegue extrair alguns tipos de informações que são conseguidas apenas por meio de requisição à API que serve o site. Segue as informações que este programa consegue extrair: 
        Tipo de máquina;
        Grupo da máquina;
        Modelo da máquina;
        Número de série da máquina;
        Número de série reduzido da máquina;
        Grupo do Produto.

    -O programa segue uma estrutura pré-definida que é a seguinte:
        tipo de máquina > grupo da máquina > modelo da máquina > número de série da máquina
    SE ESSA ESTRUTURA FOR QUEBRADA, O PROGRAMA PODERÁ RETORNAR DADOS ERRADOS. 