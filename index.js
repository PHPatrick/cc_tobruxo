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

    // await robots.input()
    // await robots.search()
    // await robots.text()
    // await robots.image()
    robots.format()

    const content = robots.state.load()

    fs.writeFile(`./content/${content.dirName}/wp-content.txt`, content.wpContent,
        function (erro) {
            if (erro) {
                throw erro;
            }
            console.log("=========================\nArquivo salvo com sucesso!\n=========================");
        });
}

start();