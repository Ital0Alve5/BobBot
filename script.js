require('dotenv').config();
const readline = require("readline");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
const hostName = require('os').hostname();
const pup = require('puppeteer');
const fs = require('fs');
const json2xls = require('json2xls');
let dados = [];
(async () => {
    console.log(' ');
    console.log(" Bob: " + "\x1b[35m", `Olá, ${hostName}!`);
    console.log(' ');
    const browser = await pup.launch({ headless: false });
    const page = await browser.newPage();
    page.setDefaultNavigationTimeout(0);
    await page.setViewport({ width: 0, height: 0 });
    await page.goto(process.env.URL);
    await Promise.all([
        await page.waitForSelector("#password"),
        await page.waitForSelector("#userid"),
        await page.type('#userid', process.env.user),
        await page.type('#password', process.env.pass),
        await page.click('[onclick="return ljs_clickLogin();"]'),
        console.log("\x1b[37m", "Bob: " + "\x1b[33m", 'ATENÇÃO: Se eu não disser que o redirecionamento está ok, aperte F5.'),
        await page.waitForNavigation(),
        console.log(' '),
        console.log("\x1b[37m", "Bob: " + "\x1b[32m", 'Redirecionamento está ok! Estou indo para o site.'),
        await page.evaluate(async () => {
            setTimeout(() => {
                document.querySelector("#content-secondary > table > tbody > tr > td:nth-child(1) > input").click();
            }, 1000);
        }),
        await page.waitForSelector('#main > div.opcContainer.opcApp > span > div > div.nav-view > ion-nav-view > ion-view > ion-content > catalog-browser > div > div.contents.stretch.ui-layout-container.animate-column > div.searchBarContainer > search-bar > div > table > tbody > tr > td.input.search-quick-input > search-quick-input > div > table > tbody > tr > td.searchInputContainer > div > form.ng-pristine.ng-valid.ng-valid-maxlength > input')
    ]);
    console.log(' ');
    console.log("\x1b[37m", "Bob: " + "\x1b[32m", 'Digite o código no search do site e dê enter.');
    startSearch(true);
    async function startSearch(repeat) {
        let código;
        if (repeat) {
            const handleEnter = async () => {
                return await page.evaluate(async () => {
                    return await new Promise(resolve => {
                        const enter = document.querySelector('[ng-model="$ctrl.queryQuick"]');
                        enter.addEventListener('keypress', (e) => {
                            const key = e.code;
                            código = e.target.value;
                            if (key == 'Enter' && código.length >= 3) {
                                resolve(true);
                            }
                        });
                    });
                });
            };
            let códigoExiste;
            const clicou = await handleEnter();
            if (clicou) {
                let h = ['|', '/', '-', '\\'];
                let i = 0;
                let loading = setInterval(() => {
                    i = (i > 3) ? 0 : i;
                    console.clear();
                    console.log("\x1b[37m", "Bob: " + "\x1b[32m" + "Me dê 5 segundos, estou pensando...", h[i]);
                    i++;
                }, 100);
                setTimeout(() => {
                    clearInterval(loading);
                    console.clear();
                }, 5500);
                códigoExiste = async () => {
                    return await page.evaluate(async () => {
                        return await new Promise(resolve => {
                            setTimeout(() => {
                                const tree = document.querySelector("#treeMain > div:nth-child(2) > catalog-tree > p > catalog-tree-node > ul");
                                if (tree) {
                                    console.log(tree);
                                    const nomes = Array.from(tree.children).map(item => {
                                        return item.getAttribute('id').replace('node10000', '');
                                    });
                                    if (nomes.indexOf('Loaders') > -1 || nomes.indexOf('Excavators') > -1) {
                                        resolve(true);
                                    }
                                    else {
                                        resolve(false);
                                    }
                                }
                                else {
                                    resolve(false);
                                }
                            }, 5500);
                        });
                    });
                };
            }
            const existeOuNão = await códigoExiste();
            if (existeOuNão) {
                const getData = async () => {
                    return await page.evaluate(async () => {
                        return await new Promise(resolve => {
                            setTimeout(() => {
                                const modelos = Array.from(document.querySelector('.catalogTree').children).map(modelo => {
                                    const nomeModelo = modelo.getAttribute('id').replace('node10000', '');
                                    if (nomeModelo == "Loaders" || nomeModelo == "Excavators") {
                                        return nomeModelo;
                                    }
                                }).filter(item => {
                                    return typeof item !== "undefined";
                                });
                                let máquina = [];
                                let escopos = [];
                                let númeroDeSérieReduzidoDaMáquina;
                                let númeroDeSérieDaMáquinaTratado;
                                modelos.forEach(modelo => {
                                    let modeloX = document.querySelector('#node10000' + modelo);
                                    let modeloAngular;
                                    if (modeloX) {
                                        modeloAngular = angular.element(modeloX);
                                        modeloEscopo = modeloAngular.scope();
                                        máquina.push({
                                            "tipoDeMáquina": modeloEscopo.node._nameClean,
                                            "grupoDaMáquina": []
                                        });
                                        escopos.push({
                                            modeloEscopo
                                        });
                                    }
                                });
                                Array.from(escopos).forEach(escopo => {
                                    Array.from(escopo.modeloEscopo.node._childrenAggregated).forEach(grupo => {
                                        const nomeDoModelo = grupo.parent._name.replace('0000-', '');
                                        const índicePrincipal = modelos.indexOf(nomeDoModelo);
                                        máquina[índicePrincipal].grupoDaMáquina.push({
                                            "nome": grupo._name,
                                            "modeloDaMáquina": []
                                        });
                                    });
                                });
                                Array.from(escopos).forEach(escopo => {
                                    Array.from(escopo.modeloEscopo.node._childrenAggregated).forEach(grupo => {
                                        const tamanho = grupo._children.length;
                                        const nomeDoModelo = grupo.parent._name.replace('0000-', '');
                                        const índicePrincipal = modelos.indexOf(nomeDoModelo);
                                        máquina[índicePrincipal].grupoDaMáquina.forEach((nome, índice) => {
                                            if (grupo._name == nome.nome) {
                                                for (let i = 0; i < tamanho; i++) {
                                                    máquina[índicePrincipal].grupoDaMáquina[índice].modeloDaMáquina.push({
                                                        "nome": grupo._children[i]._name,
                                                        "númeroDeSérieDaMáquina": []
                                                    });
                                                }
                                            }
                                        });
                                    });
                                });
                                Array.from(escopos).forEach(escopo => {
                                    Array.from(escopo.modeloEscopo.node._childrenAggregated).forEach(grupo => {
                                        Array.from(grupo._children).forEach(children => {
                                            const tamanho = children._children.length;
                                            const nomeDoModelo = grupo.parent._name.replace('0000-', '');
                                            const índicePrincipal = modelos.indexOf(nomeDoModelo);
                                            máquina[índicePrincipal].grupoDaMáquina.forEach((grupo2, índice1) => {
                                                grupo2.modeloDaMáquina.forEach((grupo3, índice2) => {
                                                    if (children._name == grupo3.nome) {
                                                        for (let i = 0; i < tamanho; i++) {
                                                            let númeroSérie;
                                                            if (children._children[i]._name.indexOf(', ') > -1) {
                                                                const arrayDeNúmerosDeSérie = children._children[i]._name.split(', ');
                                                                arrayDeNúmerosDeSérie.forEach(númeroDoArray => {
                                                                    númeroSérie = númeroDoArray;
                                                                    máquina[índicePrincipal].grupoDaMáquina[índice1].modeloDaMáquina[índice2].númeroDeSérieDaMáquina.push({
                                                                        "nome": númeroSérie,
                                                                        "númeroDeSérieReduzido": [],
                                                                        "grupoDoProduto": []
                                                                    });
                                                                });
                                                            }
                                                            else {
                                                                númeroSérie = children._children[i]._name;
                                                                máquina[índicePrincipal].grupoDaMáquina[índice1].modeloDaMáquina[índice2].númeroDeSérieDaMáquina.push({
                                                                    "nome": númeroSérie,
                                                                    "númeroDeSérieReduzido": [],
                                                                    "grupoDoProduto": []
                                                                });
                                                            }
                                                        }
                                                    }
                                                });
                                            });
                                        });
                                    });
                                });
                                Array.from(escopos).forEach(escopo => {
                                    Array.from(escopo.modeloEscopo.node._childrenAggregated).forEach(grupo => {
                                        Array.from(grupo._children).forEach(children => {
                                            Array.from(children._children).forEach(children2 => {
                                                const tamanho = children2._children.length;
                                                const nomeDoModelo = grupo.parent._name.replace('0000-', '');
                                                const índicePrincipal = modelos.indexOf(nomeDoModelo);
                                                máquina[índicePrincipal].grupoDaMáquina.forEach((grupo2, índice1) => {
                                                    grupo2.modeloDaMáquina.forEach((grupo3, índice2) => {
                                                        grupo3.númeroDeSérieDaMáquina.forEach((grupo4, índice3) => {
                                                            if (children2._name.indexOf(', ') > -1) {
                                                                const arrayDeNúmerosDeSérie = children2._name.split(', ');
                                                                arrayDeNúmerosDeSérie.forEach(númeroDoArray => {
                                                                    if (grupo4.nome == númeroDoArray) {
                                                                        for (let i = 0; i < tamanho; i++) {
                                                                            máquina[índicePrincipal].grupoDaMáquina[índice1].modeloDaMáquina[índice2].númeroDeSérieDaMáquina[índice3].grupoDoProduto.push({
                                                                                "nome": children2._children[i]._name
                                                                            });
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                            else {
                                                                if (grupo4.nome == children2._name) {
                                                                    for (let i = 0; i < tamanho; i++) {
                                                                        máquina[índicePrincipal].grupoDaMáquina[índice1].modeloDaMáquina[índice2].númeroDeSérieDaMáquina[índice3].grupoDoProduto.push({
                                                                            "nome": children2._children[i]._name
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                                let máquinaJson = [];
                                máquina.forEach(tipoDeMáquina => {
                                    tipoDeMáquina.grupoDaMáquina.forEach(grupoDaMáquina => {
                                        grupoDaMáquina.modeloDaMáquina.forEach(modeloDaMáquina => {
                                            modeloDaMáquina.númeroDeSérieDaMáquina.forEach(númeroDeSérieDaMáquina => {
                                                if (númeroDeSérieDaMáquina.nome.indexOf('-') == 4) {
                                                    númeroDeSérieDaMáquinaTratado = númeroDeSérieDaMáquina.nome.substr(5);
                                                    númeroDeSérieReduzidoDaMáquina = númeroDeSérieDaMáquina.nome.substr(5).substr(0, 4);
                                                }
                                                else {
                                                    númeroDeSérieDaMáquinaTratado = númeroDeSérieDaMáquina.nome;
                                                    númeroDeSérieReduzidoDaMáquina = númeroDeSérieDaMáquina.nome.substr(0, 4);
                                                }
                                                númeroDeSérieDaMáquina.grupoDoProduto.forEach(grupoDoProduto => {
                                                    máquinaJson.push({
                                                        "Código de Produto": código,
                                                        "Tipo de Máquina": tipoDeMáquina.tipoDeMáquina.split('-').pop(),
                                                        "Grupo da Máquina": grupoDaMáquina.nome.substring(grupoDaMáquina.nome.indexOf('-') + 1),
                                                        "Modelo da Máquina": modeloDaMáquina.nome.split('-').pop(),
                                                        "Número de Série da Máquina": númeroDeSérieDaMáquinaTratado,
                                                        "Número de Série Reduzido da Máquina": númeroDeSérieReduzidoDaMáquina,
                                                        "Grupo do Produto": grupoDoProduto.nome.split('-').pop()
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                                const itemsToString = máquinaJson.map(i => JSON.stringify(i));
                                const notRepeated = new Set(itemsToString);
                                const turnToArrayOfStringsAgain = [...notRepeated];
                                const turnToArrayOfObjectsAgain = turnToArrayOfStringsAgain.map(i => JSON.parse(i));
                                resolve(turnToArrayOfObjectsAgain);
                            }, 2000);
                        });
                    });
                };
                dados = await getData();
                const nomeDoArquivo = `${dados[0]['Código de Produto']}.xlsx`;
                console.log(" ");
                console.log("\x1b[36m", " ---------------------------------------------");
                console.log(`  | Informações salvas em \"Dados/${nomeDoArquivo}\" |`);
                console.log("  ---------------------------------------------");
                console.log(" ");
                const convert = () => {
                    const xls = json2xls(dados);
                    fs.writeFileSync(nomeDoArquivo, xls, 'binary');
                };
                convert();
                const moverPara = `Dados/${nomeDoArquivo}`;
                fs.rename(nomeDoArquivo, moverPara, err => {
                    if (err) throw err;
                });
                rl.question("\x1b[37m" + "Bob:  " + "\x1b[33m" + "Deseja continuar? [s/n]: ", (answer) => {
                    if (answer == 'sim' || answer == 'y' || answer == 'yes' || answer == 's' || answer == 'S' || answer == 'Y' || answer == 'SIM' || answer == 'YES') {
                        console.log(' ');
                        console.log("\x1b[37m" + "Bob: " + "\x1b[32m", 'OK, digite mais um código no campo do site.');
                        console.log(' ');
                        startSearch(true);
                    }
                    else if (answer == 'nao' || answer == 'n' || answer == 'no' || answer == 'não' || answer == 'N' || answer == 'NAO' || answer == 'NÃO' || answer == 'NO') {
                        console.log(' ');
                        console.log("\x1b[37m" + "Bob: " + "\x1b[35m", 'Bye.');
                        console.log(' ');
                        startSearch(false);
                    }
                });
            }
            else {
                console.log("\x1b[37m" + " Bob: " + "\x1b[31m" + " Hum...o código não retornou nada. As razões para isso podem ser: ");
                console.log("      \x1b[33m", "Código inválido: " + "\x1b[31m" + "Neste caso, verifique se digitou corretamente;");
                console.log("      \x1b[33m", "Código não retorna os tipos de máquinas Excavators e/ou Loaders: ");
                console.log("       \x1b[31m" + "Tente outro código, só conheço esses dois tipos de máquina;");
                console.log("      \x1b[33m", "A busca demorou muito e eu cansei de esperar: " + "\x1b[31m" + "Desculpe, eu");
                console.log("       espero por 5 segundos e meio, se a busca ultrapassa este tempo");
                console.log("       eu fico impaciente. Tente novamente!");
                console.log(" ");
                console.log("\x1b[37m" + " Bob: " + "\x1b[33m", "Entendeu? Então, tente novamente.");
                startSearch(true);
            }
        }
        else {
            await browser.close();
            rl.close();
        }
    }
})
    ().catch((e) => {
        console.log("Bob: " + e);
    });