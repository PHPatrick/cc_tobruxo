const fs = require("fs")
const contentFilePath = "./content.json"
const contentFilePathBlackList = "./blackList.json"

function save(content) {
    const contentString = JSON.stringify(content)
    console.log(`\n> [state-robot] Estrutura de dados salva com sucesso...`)
    return fs.writeFileSync(contentFilePath, contentString)
}

function load() {
    const fileBuffer = fs.readFileSync(contentFilePath, "utf-8")
    const contentJson = JSON.parse(fileBuffer)
    console.log(`\n> [state-robot] Estrutura de dados carregada com sucesso...`)
    return contentJson
}

function saveBlackList(blackList) {
    const contentString = JSON.stringify(blackList)
    console.log(`\n> [state-robot] Lista negra salva com sucesso...`)
    return fs.writeFileSync(contentFilePathBlackList, contentString)
}

function loadBlackList() {
    const fileBuffer = fs.readFileSync(contentFilePathBlackList, "utf-8")
    const blackListJson = JSON.parse(fileBuffer)
    console.log(`\n> [state-robot] Lista negra carregada com sucesso...`)
    return blackListJson
}

module.exports = {
    save,
    load,
    saveBlackList,
    loadBlackList
}