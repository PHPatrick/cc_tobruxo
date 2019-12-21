const fs = require("fs");

const robots = {
    input: require("./robots/input"),
    search: require("./robots/search"),
    text: require("./robots/text"),
    format: require("./robots/format"),
    state: require("./robots/state")
};

async function start() {

    // await robots.input()
    // await robots.search()
    // await robots.text()
    robots.format()

    // const content = state.load()

    // fs.writeFile(`./content/wp-content.txt`, content.wpContent,
    //     function (erro) {
    //         if (erro) {
    //             throw erro;
    //         }
    //         console.log("=========================\nArquivo salvo com sucesso!\n=========================");
    //     });
}

start();