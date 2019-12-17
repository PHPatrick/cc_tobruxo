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
            score = []
            $(".information").each(function () {
                if (countInfo < limit) {
                    let text = $(this).find(".info").text().trim()
                    if (text.indexOf("TV") === -1) {
                        console.log(`===========================\nUma URL foi removida por nao se encaixar no requisito "TV Series".\nURL removida: ${urlsByMyAnimeList[countInfo]}\n===========================`)
                        urlsByMyAnimeList.splice(countInfo, 1)
                    } else {
                        let release = $(this).find(".info").text().trim().split(",")[1]
                        let scoreMyAnimeList = $(this).find(".score").text().trim()
                        let actualYear = new Date().getFullYear();

                        let newScore = scoreMyAnimeList - ((actualYear - release) * 0.05)

                        score.push(newScore)
                    }

                    countInfo++
                }
            })

            for (let i = 0; i < urlsByMyAnimeList.length; i++) {
                urlsByMyAnimeList[i] = `${score[i]}::::${urlsByMyAnimeList[i]}`
            }

            urlsByMyAnimeList.sort().reverse()
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

        for (let i = 0; i < urlsByMyAnimeList.length; i++) {
            urlsByMyAnimeList[i] = urlsByMyAnimeList[i].split("::::")[1]
        }

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