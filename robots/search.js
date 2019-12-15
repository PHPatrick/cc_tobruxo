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
                let url = clearUrl($(this).attr("href"))

                if (verifyUrl(url)) {
                    urlsByGoogle.push(url)
                }
            })

            function clearUrl(url) {
                return url.replace("/url?q=", "").replace("/imgres?imgurl=", "").replace("%23", "#").split("&")[0]
            }

            function verifyUrl(url) {
                if (url.indexOf("https://") !== -1 && url.indexOf("youtube") === -1 && url.indexOf("google") === -1 && url.indexOf("facebook") === -1 && url.indexOf("amazon") === -1 && url.indexOf("wikipedia") === -1 && url.indexOf(".jpg") === -1 && url.indexOf(".png") === -1) {
                    return true
                }
                return false
            }

        })
    }

    async function getH2andH3ByUrls(urlsByGoogle) {
        for (let i = 0; i < urlsByGoogle.length; i++) {
            await request(urlsByGoogle[i], function (err, res, body) {
                if (err) console.log('Erro: ' + err)

                const $ = cheerio.load(body)

                eachTitle("h2")
                eachTitle("h3")

                function eachTitle(text) {
                    $(text).each(function () {
                        let title = $(this).text().trim()
                        if (title.indexOf("<") === -1) {
                            let removeSpecialCharsAndNumbers = title.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z\s]|[0-9])/g, '').toLowerCase()

                            let lines = removeSpecialCharsAndNumbers.split(" ")

                            const titleTreated = lines.filter(line => {
                                if (line.trim().length === 0 || line.trim() === / /g) {
                                    return false;
                                }
                                return true;
                            });

                            titleByUrls.push(titleTreated.join(" "));
                        }
                    })
                }

            })
        }
    }

    function filterTitles(titleByUrls, limit) {
        arr = []
        for (let i = 0; i < titleByUrls.length; i++) {
            let count = 0;

            titleByUrls.forEach((v) => (v.toLowerCase() === titleByUrls[i].toLowerCase() && count++));

            arr.push(`${count}:${titleByUrls[i]}`)
        }

        arr.sort().reverse()

        var newArr = arr.filter(function (it, i) {
            return arr.indexOf(it) === i;
        });

        return newArr.slice(0, limit);
    }


    function removeWrongTitles(popularTitles) {
        questionWrongTitle(popularTitles)

        return popularTitles

        function questionWrongTitle() {
            listPopularTitles(popularTitles)

            let wrongTitle = readline.question('-------------------\nAdicione UM numero referentes ao titulo que nao pertencem a algum anime e tecle ENTER (quando a lista estiver em ordem, digite "continue" para prosseguir): ');

            while (wrongTitle != "continue") {
                popularTitles.splice(wrongTitle - 1, 1)

                listPopularTitles(popularTitles)

                wrongTitle = readline.question('Adicione UM numero referentes ao titulo que nao pertencem a algum anime e tecle ENTER (quando a lista estiver em ordem, digite "continue" para prosseguir): ');
            }

            for (let i = 0; i < popularTitles.length; i++) {
                popularTitles[i].replace(" ", "%20")
            }
        }

        function listPopularTitles(popularTitles) {
            console.log("\n-------------------")
            for (let i = 0; i < popularTitles.length; i++) {
                let cleanTitle = popularTitles[i].replace(':', '').replace(/[0-9]/g, '')
                console.log(`${i+1} - ${cleanTitle}\n`)
            }
            console.log("-------------------\n")
        }
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
                    let url = $(this).attr("href").replace('Ψ', '').replace('★', "")

                    urls.push(url)
                    count++
                })

            })
        }

        return urls
    }

}

module.exports = robotSearch