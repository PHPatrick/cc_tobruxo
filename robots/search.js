const request = require("request-promise");
const cheerio = require("cheerio");
const readline = require("readline-sync");

async function robotSearch(url, limit) {
    const urlsByMyAnimeList = []

    await getUrlByMyAnimeList(url, limit)
    removeUnwanted(urlsByMyAnimeList)

    return urlsByMyAnimeList

    async function getUrlByMyAnimeList(url, limit) {
        await request(url, function (err, res, body) {
            if (err) console.log('Erro: ' + err)

            const $ = cheerio.load(body)

            count = 0
            $(".link-title").each(function () {
                if (count < limit) {
                    let thisUrl = $(this).attr("href").replace('Ψ', '').replace('★', '')
                    urlsByMyAnimeList.push(thisUrl)
                    count++
                }
            })

            countInfo = 0
            $(".info").each(function () {
                if (countInfo < limit) {
                    let text = $(this).text().trim()
                    if (text.indexOf("TV") === -1) {
                        console.log(`===========================\nUma URL foi removida por nao se encaixar no requisito "TV Series".\nURL removida: ${urlsByMyAnimeList[countInfo]}\n===========================`)
                        urlsByMyAnimeList.splice(countInfo, 1)
                    }
                    countInfo++
                }
            })

        })
    }

    function removeUnwanted(urlsByMyAnimeList) {
        let animeNames = []
        for (let i = 0; i < urlsByMyAnimeList.length; i++) {
            let arrName = urlsByMyAnimeList[i].split("/")
            let thisName = arrName[arrName.length - 1].replace(/_/g, ' ')
            animeNames.push(thisName)
        }

        questionUnwanted(urlsByMyAnimeList, animeNames)

        function questionUnwanted(urlsByMyAnimeList, animeNames) {
            listAnimeName(animeNames)

            let animeUnwanted = readline.question('-------------------\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ');

            while (animeUnwanted != "continue") {
                urlsByMyAnimeList.splice(animeUnwanted - 1, 1)
                animeNames.splice(animeUnwanted - 1, 1)

                listAnimeName(animeNames)

                animeUnwanted = readline.question('-------------------\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ');
            }
        }

        function listAnimeName(animeNames) {
            console.log("\n-------------------")
            for (let i = 0; i < animeNames.length; i++) {
                console.log(`${i+1} - ${animeNames[i]}\n`)
            }
            console.log("-------------------\n")
        }
    }

}

module.exports = robotSearch