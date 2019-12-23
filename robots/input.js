const readline = require("readline-sync");
const cheerio = require("cheerio");
const request = require("request-promise");
const state = require("./state")
const fs = require('fs');

async function robotInput() {
    console.log('\n> [input-robot] Start...\n')
    const content = {}
    await askType(content)
    askLimit(content)
    createDir(content)

    state.save(content)
    console.log('\n> [input-robot] Stop...\n')

    async function askType(content) {
        const prefixes = ["Animes (Genero)", "Animes (Temporada)", "Manga (Genero)"];

        const selectedPrefix = readline.keyInSelect(
            prefixes,
            "\n> [input-robot] Escolha uma opcao: "
        );

        if (selectedPrefix === 0) {
            askAnimeGenres()
            content.type = "anime"
            content.subType = "genres"
        } else if (selectedPrefix == 1) {
            await askAnimeSeason()
            content.type = "anime"
            content.subType = "season"
        } else if (selectedPrefix == 2) {
            askMangaGenres()
            content.type = "manga"
            content.subType = "genres"
        }
    }

    function askAnimeGenres() {
        const prefixes = ["Acao", "Aventura", "Carros", "Comedia", "Demencia", "Demonios", "Misterio", "Drama", "Ecchi", "Fantasia", "Game", "Hentai", "Historico", "Horror", "Kids", "Magia", "Artes Marciais", "Mecha", "Musica", "Parodia", "Samurai", "Romance", "Escola", "Sci-Fi", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Espaco", "Esportes", "Super Poderes", "Vampiro", "Yaoi", "Yuri", "Harem", "Slice of Life", "Sobrenatural", "Militar", "Policial", "Psicologicos", "Suspense", "Seinen", "Josei"];

        console.log("\n> [input-robot] ...\n")
        for (let i = 0; i < prefixes.length; i++) {
            console.log(`[ ${i+1} ] ${prefixes[i]}`)
        }
        console.log("\n")

        const selectedPrefix = readline.question("> [input-robot] Escolha um genero: ");

        content.changeSubType = prefixes[selectedPrefix - 1]
        content.urlType = `https://myanimelist.net/anime/genre/${selectedPrefix}/`
    }

    async function askAnimeSeason() {
        await request(`https://myanimelist.net/anime.php`, function (err, res, body) {
            if (err) console.log('Erro: ' + err)

            const $ = cheerio.load(body)

            let prefixes = []
            let count = 0
            $(".genre-name-link").each(function () {
                if (count < 5) {
                    let name = $(this).text().trim()

                    if (name.indexOf("Winter") !== -1 || name.indexOf("Spring") !== -1 || name.indexOf("Summer") !== -1 | name.indexOf("Fall") !== -1) {
                        prefixes.push(name)
                        count++
                    }
                }
            })

            const selectedPrefix = readline.keyInSelect(
                prefixes,
                "\n> [input-robot] Escolha uma temporada: "
            );

            let season = prefixes[selectedPrefix]
            let seasonUrl = `${season.split(" ")[1]}/${season.toLowerCase().split(" ")[0]}`

            content.changeSubType = prefixes[selectedPrefix]
            content.urlType = `https://myanimelist.net/anime/season/${seasonUrl}`
        })
    }

    function askMangaGenres() {
        const prefixes = ["Acao", "Aventura", "Carros", "Comedia", "Demencia", "Demonios", "Misterio", "Drama", "Ecchi", "Fantasia", "Game", "Hentai", "Historico", "Horror", "Kids", "Magia", "Artes Marciais", "Mecha", "Musica", "Parodia", "Samurai", "Romance", "Escola", "Sci-Fi", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Espaco", "Esportes", "Super Poderes", "Vampiro", "Yaoi", "Yuri", "Harem", "Slice of Life", "Sobrenatural", "Militar", "Policial", "Psicologicos", "Seinen", "Josei", "Doujinshi", "Bender", "Suspense"];

        console.log("\n> [input-robot] ...\n")
        for (let i = 0; i < prefixes.length; i++) {
            console.log(`[ ${i+1} ] ${prefixes[i]}`)
        }
        console.log("\n")

        const selectedPrefix = readline.question("> [input-robot] Escolha um genero: ");

        content.changeSubType = prefixes[selectedPrefix - 1]
        content.urlType = `https://myanimelist.net/manga/genre/${selectedPrefix}/`
    }

    function askLimit(content) {
        const type = content.urlType.indexOf("manga") !== -1 ? "mangas" : "animes"
        let itemsLimit = readline.question(`\n> [input-robot] Quantidade de ${type}: `);

        content.limit = itemsLimit
    }

    function createDir(content) {
        const dirName = `${content.type}_${content.subType}-${content.changeSubType.toLowerCase()}`
        content.dirName = dirName

        const dir = `./content/${content.dirName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        } else {
            console.log(`\n> [input-robot] Uma pasta referente a este conteudo (${content.dirName}) ja existe, para criacao de um novo conteudo sobre este assunto, sera necessario excluir a pasta "${content.dirName}" e executar o programa novamente.\nCaminho: ./content/${content.dirName}\n`)
            process.exit(0)
        }
    }
}

module.exports = robotInput