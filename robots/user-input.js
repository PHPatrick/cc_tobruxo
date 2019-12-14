const readline = require("readline-sync");

function userInput() {
    keyword = askKeyword()
    limit = askLimit()

    return [keyword, limit]

    function askKeyword() {
        let userAskKeyword = readline.question("Insira a palavra chave: ");

        return userAskKeyword
    }

    function askLimit() {
        let userAskLimit = readline.question("Quantidade de animes: ");

        return userAskLimit
    }
}

module.exports = userInput