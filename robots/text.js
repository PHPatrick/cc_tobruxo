const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const api = require("../keys/google-translate.json").API_KEY
const googleTranslate = require("google-translate")(api);

async function robotText(urlsMyAnimeList) {
    const animes = []

    for (let i = 0; i < urlsMyAnimeList.length; i++) {
        animes.push({
            url: urlsMyAnimeList[i],
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
        })
    }

    for (let i = 0; i < animes.length; i++) {
        await captureContentFromMyAnimeList(animes[i])
        treatContent(animes[i])
        await translateContent(animes[i])
    }

    return animes


    async function captureContentFromMyAnimeList(anime) {
        await requestPromise(anime.url, (err, res, body) => {
            if (err) console.log("Erro: " + err);

            const $ = cheerio.load(body);

            anime.name = $(".h1 [itemprop=name]").text().trim();

            $(".spaceit_pad").each(function () {
                let lang = $(this).text().trim().split(":")[0];
                let text = $(this).text().trim().split(":")[1];

                (lang === "English") ? anime.info.nameEnglish = text:
                    (lang === "Japanese") ? anime.info.nameJapanese = text : false
            })

            $(".js-scrollfix-bottom div").each(function () {
                let type = $(this).text().trim().split(":")[0];
                let text = $(this).text().trim().split(":")[1];

                (type === "Episodes") ? anime.info.episodes = text:
                    (type === "Aired") ? anime.info.aired = text :
                    (type === "Genres") ? anime.info.genres = text :
                    (type === "Studios") ? anime.info.studios = text : false
            })

            anime.synopsis = $("[itemprop=description]").text().trim();
        });
    }

    function treatContent(anime) {
        removeBlankLinesAndMarkdown(anime)

        function removeBlankLinesAndMarkdown(anime) {
            for (var key in anime) {
                if (key === "name" || key === "synopsis") {
                    const lines = anime[key].split("\n")

                    const arrText = lines.filter(line => {
                        if (line.trim().length === 0 || line.trim().startsWith("[")) {
                            return false;
                        }
                        return true;
                    });

                    cleanText = arrText.join(" ");

                    anime[key] = cleanText
                }
            }

            for (var key in anime.info) {
                const lines = anime.info[key].split("\n")

                const arrText = lines.filter(line => {
                    if (line.trim().length === 0) {
                        return false;
                    }
                    return true;
                });

                cleanText = arrText.toString();

                anime.info[key] = cleanText.replace(/  /g, "")
            }
        }
    }

    async function translateContent(anime) {
        anime.synopsis = await translateContent(anime.synopsis)
        anime.info.genres = await translateContent(anime.info.genres)
        anime.info.aired = await translateContent(anime.info.aired)

        async function translateContent(text) {
            return new Promise(async (resolve, reject) => {
                await googleTranslate.translate(text, 'pt-BR', function (err, translation) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(translation.translatedText);
                    }
                });
            });
        }
    }
}

module.exports = robotText