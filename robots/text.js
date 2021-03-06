const requestPromise = require('request-promise')
const cheerio = require('cheerio')
const api = require('../keys/google-translate.json').API_KEY
const googleTranslate = require('google-translate')(api)
const state = require('./state')

async function robotText () {
  console.log('\n> [text-robot] Start...\n')
  const content = state.load()
  content.items = []

  for (let i = 0; i < content.urlsItems.length; i++) {
    console.log(`\n> [robot-text] [${content.type}] [${i + 1}] Coletando, tratando e traduzindo o conteudo...`)
    await captureContent(content.urlsItems[i])
    treatContent(content.items[i])
    await translateContent(content.items[i])
  }

  state.save(content)
  console.log('\n> [text-robot] Stop...\n')

  async function captureContent (url) {
    await requestPromise(url, (err, res, body) => {
      if (err) console.log(`Erro: ${err}`)

      const $ = cheerio.load(body)

      if (content.type === 'anime' || content.type === 'custom') {
        captureContentForAnimes()
      } else if (content.type === 'manga') {
        captureContentForMangas()
      }

      function captureContentForAnimes () {
        const anime = {
          url: '',
          name: '',
          info: {
            nameEnglish: '',
            nameJapanese: '',
            episodes: '...',
            genres: '',
            aired: '',
            studios: '',
            trailer: 'Teaser',
            watch: '??'
          },
          synopsis: '',
          images: '',
          imgPath: '',
          structuredData: {
            '@context': 'http://schema.org',
            '@type': 'TVSeries',
            actor: [],
            name: '',
            numberOfEpisodes: ''
          }
        }

        anime.url = url
        anime.name = $('.h1 [itemprop=name]').text().trim()

        $('.spaceit_pad').each(function () {
          const lang = $(this).text().trim().split(':')[0]
          const text = $(this).text().trim().split(':')[1]

          if (lang === 'English') anime.info.nameEnglish = text
          else if (lang === 'Japanese') anime.info.nameJapanese = text
        })

        $('.js-scrollfix-bottom div').each(function () {
          const type = $(this).text().trim().split(':')[0]
          const text = $(this).text().trim().split(':')[1]
          const arrGenre = []

          if (type === 'Episodes') anime.info.episodes = text
          else if (type === 'Aired') anime.info.aired = text
          else if (type === 'Genres') {
            $(this).find("[itemprop='genre']").each(function () {
              arrGenre.push($(this).text().trim())
            })
            anime.info.genres = arrGenre.join(', ')
          } else if (type === 'Studios') anime.info.studios = text
        })

        anime.synopsis = $('[itemprop=description]').text().trim()
        anime.imgPath = ''

        if ($('.video-promotion a').attr('href')) {
          anime.info.trailer = `<a href="${$('.video-promotion a').attr('href')}" target="_blank" rel="noreferrer noopener" aria-label="Teaser (abre numa nova aba)">Teaser</a>`
        } else {
          anime.info.trailer = 'Teaser'
        }
        anime.info.watch = '??'

        $('.detail-characters-list .borderClass a').each(function () {
          const clearActor = $(this).text().trim().replace('\n', '')
            .replace(/ /g, '')
          if (clearActor.length !== 0) {
            const arrActor = clearActor.split(',')
            const actor = {
              '@type': 'Person',
              name: arrActor.join(', ')
            }
            anime.structuredData.actor.push(actor)
          }
        })

        anime.structuredData.name = anime.name
        anime.structuredData.numberOfEpisodes = anime.info.episodes.replace('\n', '').replace(/ /g, '')

        content.items.push(anime)
      }

      function captureContentForMangas () {
        const manga = {
          url: '',
          name: '',
          info: {
            nameEnglish: '',
            nameJapanese: '',
            volumes: '...',
            chapters: '',
            status: '',
            published: '',
            genres: '',
            authors: '',
            serialization: ''
          },
          synopsis: '',
          analyze: '',
          images: '',
          imgPath: '',
          structuredData: {
            '@context': 'http://schema.org',
            '@type': '',
            actor: [],
            name: ''
          }
        }

        manga.url = url
        manga.name = $('.h1 [itemprop=name]').text().trim()

        $('.spaceit_pad').each(function () {
          const lang = $(this).text().trim().split(':')[0]
          const text = $(this).text().trim().split(':')[1]

          if (lang === 'English') manga.info.nameEnglish = text
          else if (lang === 'Japanese') manga.info.nameJapanese = text
        })

        $('.js-scrollfix-bottom div').each(function () {
          const type = $(this).text().trim().split(':')[0]
          const text = $(this).text().trim().split(':')[1]
          const arrGenre = []

          if (type === 'Volumes') manga.info.volumes = text
          else if (type === 'Chapters') manga.info.chapters = text
          else if (type === 'Status') manga.info.status = text
          else if (type === 'Published') manga.info.published = text
          else if (type === 'Genres') {
            $(this).find("[itemprop='genre']").each(function () {
              arrGenre.push($(this).text().trim())
            })
            manga.info.genres = arrGenre.join(', ')
          } else if (type === 'Authors') manga.info.authors = text
          else if (type === 'Serialization') manga.info.serialization = text
        })

        manga.synopsis = $('[itemprop=description]').text().trim()
        manga.imgPath = ''

        content.items.push(manga)
      }
    })
  }

  function treatContent (item) {
    removeBlankLinesAndMarkdown(item)

    function removeBlankLinesAndMarkdown (item) {
      for (const key in item) {
        if (key === 'name' || key === 'synopsis') {
          const lines = item[key].split('\n')

          const arrText = lines.filter((line) => {
            if (line.trim().length === 0 || line.trim().startsWith('[')) {
              return false
            }
            return true
          })

          const cleanText = arrText.join(' ')

          item[key] = cleanText
        }
      }

      for (const keyInfo in item.info) {
        const lines = item.info[keyInfo].split('\n')

        const arrText = lines.filter((line) => {
          if (line.trim().length === 0) {
            return false
          }
          return true
        })

        const cleanText = arrText.toString()

        item.info[keyInfo] = cleanText.replace(/ {2}/g, '')
      }
    }
  }

  async function translateContent (item) {
    if (content.type === 'anime') {
      item.synopsis = await translateItem(item.synopsis)
      item.info.genres = await translateItem(item.info.genres)
      item.info.aired = await translateItem(item.info.aired)
    } else if (content.type === 'manga') {
      item.synopsis = await translateItem(item.synopsis)
      item.info.status = await translateItem(item.info.status)
      item.info.published = await translateItem(item.info.published)
      item.info.genres = await translateItem(item.info.genres)
    }

    async function translateItem (text) {
      return new Promise((resolve, reject) => {
        googleTranslate.translate(text, 'pt-BR', (err, translation) => {
          if (err) {
            reject(err)
          } else {
            resolve(translation.translatedText)
          }
        })
      })
    }
  }
}

module.exports = robotText
