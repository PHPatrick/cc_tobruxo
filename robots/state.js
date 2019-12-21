const fs = require("fs")
const contentFilePath = "./content.json"

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

module.exports = {
    save,
    load
}