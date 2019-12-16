const readline = require("readline-sync");
const cheerio = require("cheerio");
const request = require("request-promise");

async function userInput() {
    const prefix = askType()
    const url = []
    const archiveName = []
    if (prefix === 0) {
        askGenres()
    } else if (prefix == 1) {
        await askSeason()
    }

    const limit = askLimit()

    return [url.toString(), archiveName.toString(), limit]

    function askType() {
        const prefixes = ["Genero", "Temporada"];

        const selectedPrefix = readline.keyInSelect(
            prefixes,
            "\nEscolha uma opcao: "
        );

        return selectedPrefix
    }

    function askGenres() {
        const prefixes = ["Acao", "Aventura", "Carros", "Comedia", "Demencia", "Demonios", "Misterio", "Drama", "Ecchi", "Fantasia", "Game", "Hentai", "Historico", "Horror", "Kids", "Magia", "Artes Marciais", "Mecha", "Musica", "Parodia", "Samurai", "Romance", "Escola", "Sci-Fi", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Espaco", "Esportes", "Super Poderes", "Vampiro", "Yaoi", "Yuri", "Harem", "Slice of Life", "Sobrenatural", "Militar", "Policial", "Psicologicos", "Suspense", "Seinen", "Josei"];

        console.log("\n")
        for (let i = 0; i < prefixes.length; i++) {
            console.log(`[ ${i+1} ] ${prefixes[i]}`)
        }
        console.log("\n")

        const selectedGenre = readline.question("Escolha um genero: ");

        url.push(`https://myanimelist.net/anime/genre/${selectedGenre}/`)
        archiveName.push(prefixes[selectedGenre - 1].normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''))
    }

    async function askSeason() {
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
                "\nEscolha uma temporada: "
            );

            let season = prefixes[selectedPrefix]
            let seasonUrl = `${season.split(" ")[1]}/${season.toLowerCase().split(" ")[0]}`

            url.push(`https://myanimelist.net/anime/season/${seasonUrl}`)
            archiveName.push(season.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, ''))
        })
    }

    function askLimit() {
        let userAskLimit = readline.question("Quantidade de animes: ");

        return userAskLimit
    }
}

module.exports = userInput