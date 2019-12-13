const readline = require("readline-sync");

function userInput(anime) {
    anime.url = askUrlMyAnimeList()
    anime.archive = askArchiveAnime()

    function askUrlMyAnimeList() {
        let ask = readline.question("Insira a URL do anime (MYANIMELIST): ");

        while (ask.indexOf("https://myanimelist.net/")) {
            ask = readline.question(`A URL inserida (${ask}) não pertence ao site "MYANIMELIST"\nPor favor, insira uma URL válida: `);
        }

        return ask
    }

    function askArchiveAnime() {
        let askArchive = readline.question("Nome do documento em que deseja salvar a estrutura: ");

        return askArchive
    }
}

module.exports = userInput