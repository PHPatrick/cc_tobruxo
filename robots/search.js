const request = require("request-promise");
const cheerio = require("cheerio");
const readline = require("readline-sync");

async function robotSearch(keyword, limit) {
    const urlsByGoogle = []
    const titleByUrls = []
    await getUrlByGoogle(keyword)
    await getH2andH3ByUrls(urlsByGoogle)
    const popularTitles = filterTitles(titleByUrls, limit)
    const removedWrongTitles = removeWrongTitles(popularTitles)
    urlsMyAnimeList = await getUrlsMyAnimeList(removedWrongTitles)

    return urlsMyAnimeList

    async function getUrlByGoogle(keyword) {
        await request(`https://www.google.com/search?q=${keyword.replace(" ", "+")}`, function (err, res, body) {
            if (err) console.log('Erro: ' + err)

            const $ = cheerio.load(body)


            $("a").each(function () {
                let url = $(this).attr("href").replace("/url?q=", "").split("&")[0]
                if (url.indexOf("https://") !== -1 && url.indexOf("youtube") === -1 && url.indexOf("google") === -1 && url.indexOf("facebook") === -1) {
                    urlsByGoogle.push(url)
                }
            })
        })
    }

    async function getH2andH3ByUrls(urlsByGoogle) {
        for (let i = 0; i < urlsByGoogle.length; i++) {
            await request(urlsByGoogle[i], function (err, res, body) {
                if (err) console.log('Erro: ' + err)

                const $ = cheerio.load(body)

                $("h2").each(function () {
                    let h2 = $(this).text().trim()
                    if (h2.indexOf("<") === -1) {
                        let removeSpecialCharsAndNumbers = h2.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s]|[0-9])/g, '').toLowerCase()

                        let lines = removeSpecialCharsAndNumbers.split(" ")

                        const h2Treated = lines.filter(line => {
                            if (line.trim().length === 0 || line.trim() === / /g) {
                                return false;
                            }
                            return true;
                        });

                        titleByUrls.push(h2Treated.join("%20"));
                    }
                })

                $("h3").each(function () {
                    let h3 = $(this).text().trim()
                    if (h3.indexOf("<") === -1) {
                        let removeSpecialCharsAndNumbers = h3.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s]|[0-9])/g, '').toLowerCase()

                        let lines = removeSpecialCharsAndNumbers.split(" ")

                        const h3Treated = lines.filter(line => {
                            if (line.trim().length === 0 || line.trim() === / /g) {
                                return false;
                            }
                            return true;
                        });

                        titleByUrls.push(h3Treated.join("%20"));
                    }
                })

            })
        }
    }

    function filterTitles(titleByUrls, limit) {
        arr = []
        for (let i = 0; i < titleByUrls.length; i++) {

            let count = 0;
            titleByUrls.forEach((v) => (v === titleByUrls[i] && count++));

            arr.push(`${count}:${titleByUrls[i]}`)
        }

        arr.sort().reverse()
        let newArr = arr.filter((it, i) => arr.indexOf(it) === i);
        return newArr.slice(0, limit);
    }

    function removeWrongTitles(popularTitles) {
        console.log("\n-------------------")
        for (let i = 0; i < popularTitles.length; i++) {
            let cleanText = popularTitles[i].normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z]|[0-9])/g, '')
            console.log(`${i+1} - ${cleanText}\n`)
        }
        console.log("-------------------\n")

        let wrongTitle = readline.question('-------------------\nAdicione UM numero referentes ao titúlo que não pertencem a algum anime e tecle ENTER (quando a lista estiver em ordem, digite "continue" para prosseguir): ');


        while (wrongTitle != "continue") {
            popularTitles.splice(wrongTitle - 1, 1)
            console.log("\n-------------------")
            for (let i = 0; i < popularTitles.length; i++) {
                let cleanText = popularTitles[i].normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z]|[0-9])/g, '')
                console.log(`${i+1} - ${cleanText}\n`)
            }
            console.log("-------------------\n")
            wrongTitle = readline.question('Adicione UM numero referentes ao titúlo que não pertencem a algum anime e tecle ENTER (quando a lista estiver em ordem, digite "continue" para prosseguir): ');
        }

        return popularTitles
    }

    async function getUrlsMyAnimeList(search) {
        let urls = []
        for (let i = 0; i < search.length; i++) {
            await request(`https://myanimelist.net/search/all?q=${search[i].split(":")[1]}`, function (err, res, body) {
                if (err) console.log('Erro: ' + err)

                const $ = cheerio.load(body)

                let count = 0
                $(".hoverinfo_trigger").each(function () {
                    if (count > 0) return

                    urls.push($(this).attr("href").replace('Ψ', '').replace('★', ""))
                    count++
                })

            })
        }

        return urls
    }

}

module.exports = robotSearch