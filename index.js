const fs = require("fs");

const robots = {
    userInput: require("./robots/user-input"),
    search: require("./robots/search"),
    text: require("./robots/text"),
    format: require("./robots/format"),
};

async function start() {

    const [keyword, limit] = robots.userInput()
    const urlsMyAnimeList = await robots.search(keyword, limit)
    const animes = await robots.text(urlsMyAnimeList)
    const content = robots.format(animes)

    fs.writeFile(`./archive/${keyword.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '')}.txt`, content,
        function (erro) {
            if (erro) {
                throw erro;
            }
            console.log("=========================\nArquivo salvo com sucesso!\n=========================");
        });
}

start();