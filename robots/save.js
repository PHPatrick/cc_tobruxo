const readline = require('readline-sync')
const fs = require('fs')
const state = require('./state')

async function saveRobot () {
  const content = state.load()
  console.log('> [save-robot] Start...')
  saveContent(content)
  generateStructuredData(content)
  wantToSaveTheBlackList(content.urlsItems)

  function saveContent (content) {
    fs.writeFileSync(`./content/${content.dirName}/wp-content.txt`, content.wpContent)
    console.log('\n> [save-robot] Wp-content salvo com sucesso!')
  }

  function generateStructuredData (content) {
    const openTagScript = '<script type="application/ld+json">'
    const closeTagScript = '</script>'
    const arrStructuredData = []

    for (let i = 0; i < content.items.length; i++) {
      arrStructuredData.push(content.items[i].structuredData)
    }

    const structuredDataContent = openTagScript + JSON.stringify(arrStructuredData) + closeTagScript

    fs.writeFileSync(`./content/${content.dirName}/dados-estruturados.txt`, structuredDataContent)
    console.log('\n> [save-robot] Dados estruturados salvos com sucesso!')
  }

  function wantToSaveTheBlackList (urlsItems) {
    const blackList = state.loadBlackList()
    const prefixes = ['SIM', 'NAO']

    const selectedPrefix = readline.keyInSelect(
      prefixes,
      "> Deseja atualizar a lista negra?\n IMPORTANTE!!\n Somente responda 'SIM' apos a publicacao do artigo.\n>"
    )

    if (selectedPrefix === 0) {
      for (let i = 0; i < urlsItems.length; i++) {
        blackList.urls.push(urlsItems[i])
      }
      state.saveBlackList(blackList)
    }
    console.log('\n[ ToBruxo ] Obrigado por utilizar CC_ToBruxo\n Encontrou algum bug? Reporte em nosso repositorio do github!\nhttps://github.com/gabzedine/cc_tobruxo')
  }
}

module.exports = saveRobot
