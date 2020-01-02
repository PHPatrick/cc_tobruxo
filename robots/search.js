// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const request = require('request-promise')
const cheerio = require('cheerio')
const readline = require('readline-sync')
const state = require('./state')

async function robotSearch () {
  console.log('\n> [search-robot] Start...\n')
  const content = state.load()
  const blackList = state.loadBlackList()
  content.urlsItems = []

  await getUrlByMyAnimeList(content.urlType, content.limit, blackList)
  await getInformationForUrls(content)

  removeUnwanted(content)

  state.save(content)
  console.log('\n> [search-robot] Stop...\n')

  async function getUrlByMyAnimeList (url, limit, blackList) {
    await request(url, function (err, res, body) {
      if (err) console.log('Erro: ' + err)

      const $ = cheerio.load(body)

      let count = 0
      $('.seasonal-anime').each(function () {
        if (count < limit) {
          const thisUrl = $(this).find('.link-title').attr('href').replace(/Ψ/g, '').replace(/★/g, '').replace(/√/g, '').replace(/☆/g, '').replace(/½/g, '')

          const text = $(this).find('.information .info').text().trim()

          if ((text.indexOf('TV') === -1 && content.type === 'anime') || blackList.urls.includes(thisUrl)) {
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

  async function getInformationForUrls (content) {
    console.log('\n> [search-robot] Ordenando o conteudo pelo score, aguarde...')
    for (let i = 0; i < content.urlsItems.length; i++) {
      await request(content.urlsItems[i], function (err, res, body) {
        if (err) console.log('Erro: ' + err)

        const $ = cheerio.load(body)

        const release = $('.information-block .season a').text().trim().split(' ')[1]
        const scoreMyAnimeList = $("[data-title='score']").text().trim()
        const actualYear = new Date().getFullYear()

        const newScore = scoreMyAnimeList - ((actualYear - release) * 0.05)

        content.urlsItems[i] = `${newScore}::::${content.urlsItems[i]}`
      })
    }
    content.urlsItems.sort().reverse()
  }

  function removeUnwanted (content) {
    const itemsNames = []
    for (let i = 0; i < content.urlsItems.length; i++) {
      const arrName = content.urlsItems[i].split('/')
      const thisName = arrName[arrName.length - 1].replace(/_/g, ' ')
      itemsNames.push(thisName)
    }

    listItemsNames(itemsNames)

    let itemUnwanted = readline.question('> [search-robot] ...\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ')

    while (itemUnwanted !== 'continue') {
      // eslint-disable-next-line no-sequences
      console.log(`\n> [search-robot] ${itemsNames[itemUnwanted - 1, 1]} - [ REMOVIDO ]`)
      content.urlsItems.splice(itemUnwanted - 1, 1)
      itemsNames.splice(itemUnwanted - 1, 1)

      listItemsNames(itemsNames)

      itemUnwanted = readline.question('> [search-robot] ...\nDeseja remover algum anime?\nDigite o numero correspondente e tecle ENTER (para continuar digite "continue" e tecle ENTER): ')
    }

    for (let i = 0; i < content.urlsItems.length; i++) {
      content.urlsItems[i] = content.urlsItems[i].split('::::')[1]
    }
  }

  function listItemsNames (itemsNames) {
    console.log('\n> [search-robot] ...\n-------------------\n')
    for (let i = 0; i < itemsNames.length; i++) {
      console.log(`${i + 1} - ${itemsNames[i]}\n`)
    }
    console.log('-------------------\n')
  }
}

module.exports = robotSearch
