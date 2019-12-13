const fs = require("fs");

const robots = {
    userInput: require("./robots/user-input"),
    text: require("./robots/text"),
    format: require("./robots/format"),
};

async function start() {
    const anime = {
        url: "",
        name: "",
        info: {
            nameEnglish: "",
            nameJapanese: "",
            episodes: "...",
            genres: "",
            aired: "",
            studios: "",
            trailer: "Teaser",
            watch: "??"
        },
        synopsis: "",
        archive: "deathnote",
    };

    robots.userInput(anime)
    await robots.text(anime)
    const content = robots.format(anime)


    fs.writeFile(`./archive/${anime.archive}.txt`, content,
        function (erro) {
            if (erro) {
                throw erro;
            }
            console.log("Arquivo salvo com sucesso!");
        });
}

start();