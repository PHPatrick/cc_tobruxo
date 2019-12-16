const fs = require("fs");

const robots = {
    userInput: require("./robots/user-input"),
    search: require("./robots/search"),
    text: require("./robots/text"),
    format: require("./robots/format"),
};

async function start() {

    const [url, archiveName, limit] = await robots.userInput()
    const urlsMyAnimeList = await robots.search(url, limit)
    const animes = await robots.text(urlsMyAnimeList)
    const content = robots.format(animes)

    fs.writeFile(`./archive/${archiveName}.txt`, content,
        function (erro) {
            if (erro) {
                throw erro;
            }
            console.log("=========================\nArquivo salvo com sucesso!\n=========================");
        });
}

start();