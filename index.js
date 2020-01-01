const readline = require("readline-sync");
const fs = require("fs");

const robots = {
    input: require("./robots/input"),
    search: require("./robots/search"),
    text: require("./robots/text"),
    image: require("./robots/image"),
    format: require("./robots/format"),
    state: require("./robots/state")
};

async function start() {

    await robots.input()
    await robots.search()
    await robots.text()
    await robots.image()
    robots.format()

    const content = robots.state.load()

    wantToSaveTheBlackList(content.urlsItems)

    fs.writeFile(`./content/${content.dirName}/wp-content.txt`, content.wpContent,
        function (erro) {
            if (erro) {
                throw erro;
            }
            console.log("[ ToBruxo ] Obrigado por utilizar CC_ToBruxo\n Encontrou algum bug? Reporte em nosso repositorio do github!\nhttps://github.com/gabzedine/cc_tobruxo")
        });

    function wantToSaveTheBlackList(urlsItems) {
        const blackList = robots.state.loadBlackList()
        const prefixes = ["SIM", "NAO"];

        const selectedPrefix = readline.keyInSelect(
            prefixes,
            "> Deseja atualizar a lista negra?\n IMPORTANTE!!\n Somente responda 'SIM' apos a publicacao do artigo.\n>"
        );

        if (selectedPrefix === 0) {
            for (let i = 0; i < urlsItems.length; i++) {
                blackList.urls.push(urlsItems[i])
            }
            robots.state.saveBlackList(blackList)
        }
        console.log("\n[ ... ]\n")
    }
}

start();