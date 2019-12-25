// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require("request-promise");
const cheerio = require("cheerio");
const readline = require("readline-sync");
const state = require("./state")

async function robotSearch() {
    console.log('\n> [search-robot] Start...\n')
    const content = state.load()
    content.urlsItems = []

    await getUrlByMyAnimeList(content.urlType, content.limit)
    await getInformationForUrls(content.urlType, content.limit)
    removeUnwanted(content)

    state.save(content)
    console.log('\n> [search-robot] Stop...\n')

    async function getUrlByMyAnimeList(url, limit) {
        await request(url, function (err, res, body) {
            if (err) console.log('Erro: ' + err)

            const $ = cheerio.load(body)

            count = 0
            $(".seasonal-anime").each(function () {
                if (count < limit) {
                    let thisUrl = $(this).find(".link-title").attr("href").replace(/Ψ/g, '').replace(/★/g, '').replace(/√/g, '').replace(/☆/g, '').replace(/½/g, '')

                    let text = $(this).find(".information .info").text().trim()

                    if (text.indexOf("TV") === -1 && content.type === "anime") {
                        console.log(`\n> [search-robot] URL ignorada por nao se encaixar nos requisitos: ${thisUrl}`)
                    } else {
                        content.urlsItems.push(thisUrl)
                        console.log(`\n> [search-robot] Adicionando URL: ${thisUrl}`)
                        count++
                    }
                }
            })
        })
    }

    async function getInformationForUrls(url, limit) {
        await request(url, function (err, res, body) {
            if (err) console.log('Erro: ' + err)

            const $ = cheerio.load(body)

            countInfo = 0
            score = []
            $(".information").each(function () {
                if (countInfo < limit) {
                    let release = $(this).find(".info").text().trim().split(",")[1]
                    let scoreMyAnimeList = $(this).find(".score").text().trim()
                    let actualYear = new Date().getFullYear();

                    let newScore = scoreMyAnimeList - ((actualYear - release) * 0.05)
                    score.push(newScore)
                    countInfo++
                }
            })

            for (let i = 0; i < content.urlsItems.length; i++) {
                content.urlsItems[i] = `${score[i]}::::${content.urlsItems[i]}`
            }

            content.urlsItems.sort().reverse()
        })
    }

    function removeUnwanted(content) {
        let itemsNames = []
        for (let i = 0; i < content.urlsItems.length; i++) {
            let arrName = content.urlsItems[i].split("/")
            let thisName = arrName[arrName.length - 1].replace(/_/g, ' ')
            itemsNames.push(thisName)
        }

        listItemsNames(itemsNames)

        let itemUnwanted = readline.question('> [search-robot] ...\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ');

        while (itemUnwanted != "continue") {
            console.log(`\n> [search-robot] ${itemsNames[itemUnwanted - 1, 1]} - [ REMOVIDO ]`)
            content.urlsItems.splice(itemUnwanted - 1, 1)
            itemsNames.splice(itemUnwanted - 1, 1)

            listItemsNames(itemsNames)

            itemUnwanted = readline.question('> [search-robot] ...\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ');
        }

        for (let i = 0; i < content.urlsItems.length; i++) {
            content.urlsItems[i] = content.urlsItems[i].split("::::")[1]
        }
    }


    function listItemsNames(itemsNames) {
        console.log("\n> [search-robot] ...\n-------------------\n")
        for (let i = 0; i < itemsNames.length; i++) {
            console.log(`${i+1} - ${itemsNames[i]}\n`)
        }
        console.log("-------------------\n")
    }

}

module.exports = robotSearch