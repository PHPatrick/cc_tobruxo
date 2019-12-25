const fs = require("fs");
const state = require("./state")

function robotFormat() {
    console.log('\n> [text-format] Start...\n')
    const content = state.load()

    generateStructure(content.items)
    generateStructuredData(content.items)

    console.log("[robot-format] Formatação concluida")

    state.save(content)
    console.log('\n> [format-robot] Stop...\n')

    function generateStructure(item) {
        let structureContent = ""
        let list = ""

        let tableNames = generateTableNames(content.items)


        for (let i = 0; i < item.length; i++) {
            console.log(`\n> [format-robot] [${i+1}] [${item[i].name}] Formatando...\n`)
            const title = `<!-- wp:heading -->\n<h2>${item[i].name}</h2>\n<!-- /wp:heading -->`
            const image = `<!-- wp:image {"align":"wide","sizeSlug":"large"} -->
<figure class="wp-block-image alignwide size-large"><img src="${item[i].imgPath}?" alt="${item[i].name}"/></figure>
<!-- /wp:image -->`

            if (content.type === "anime") {
                list = animeInfoStructure(item[i])
            } else if (content.type === "manga") {
                list = mangaInfoStructure(item[i])
            }

            const linesSynopsis = item[i].synopsis.split(". ")
            const removeLastParagraph = `<!-- wp:paragraph -->\n<p>${linesSynopsis.join(".</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>")}`
            const synopsis = removeLastParagraph.substring(0, removeLastParagraph.lastIndexOf("<!--"));


            structureContent = structureContent + `${title}\n${image}\n${list}\n<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:paragraph -->
<p><strong>Sinopse:</strong></p>
<!-- /wp:paragraph -->\n${synopsis}<!-- wp:separator {"color":"quaternary"} -->
<hr class="wp-block-separator has-text-color has-background has-quaternary-background-color has-quaternary-color"/>
<!-- /wp:separator -->`
        }

        content.wpContent = `${tableNames} ${structureContent}`
    }

    function generateTableNames(item) {
        let head = `<!-- wp:columns --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph {"align":"left"} --><p class="has-text-align-left"><strong>Nome em inglês</strong></p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>`

        let thisNameEnglish = []
        for (let i = 0; i < item.length; i++) {
            let verifyExist = item[i].info.nameEnglish.length === 0 ? "---" : item[i].info.nameEnglish
            thisNameEnglish.push(`<li>${verifyExist}</li>`)
        }

        let mid = `</ol><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph {"align":"left"} --><p class="has-text-align-left"><strong>Nome em japonês</strong></p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>`

        let thisNameJapanese = []
        for (let i = 0; i < item.length; i++) {
            let verifyNameJapanese = item[i].info.nameEnglish.indexOf(item[i].name) !== -1 ? "---" : item[i].name
            thisNameJapanese.push(`<li>${verifyNameJapanese}</li>`)
        }

        let foot = `</ol><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator --><hr class="wp-block-separator"/><!-- /wp:separator -->`

        return head + thisNameEnglish.join("\n") + mid + thisNameJapanese.join("\n") + foot
    }

    function animeInfoStructure(item) {
        return `<!-- wp:list -->
    <ul>
        <li><strong>Nome em Inglês: </strong>&nbsp;${item.info.nameEnglish}<br><strong>Nome em Japonês:</strong> ${item.info.nameJapanese}</li>
        <li><strong>Gênero:</strong>&nbsp;${item.info.genres}</li>
        <li><strong>Episódios:</strong>&nbsp;${item.info.episodes}</li>
        <li><strong>Exibido:</strong>&nbsp;${item.info.aired}</li>
        <li><strong>Estúdio:</strong>&nbsp;${item.info.studios}</li>
        <li><strong>Trailer:</strong>&nbsp;${item.info.trailer}</li>
        <li><strong>Onde Assistir:</strong>&nbsp;${item.info.watch}</li>
    </ul>
    <!-- /wp:list -->`
    }

    function mangaInfoStructure(item) {
        return `<!-- wp:list -->
    <ul>
        <li><strong>Nome em Inglês: </strong>&nbsp;${item.info.nameEnglish}<br><strong>Nome em Japonês:</strong> ${item.info.nameJapanese}</li>
        <li><strong>Gênero:</strong>&nbsp;${item.info.genres}</li>
        <li><strong>Volumes:</strong>&nbsp;${item.info.volumes}</li>
        <li><strong>Capítulos:</strong>&nbsp;${item.info.chapters}</li>
        <li><strong>Publicadas:</strong>&nbsp;${item.info.published}</li>
        <li><strong>Autor(s):</strong>&nbsp;${item.info.authors}</li>
        <li><strong>Estúdio:</strong>&nbsp;${item.info.studios}</li>
        <li><strong>Serialização:</strong>&nbsp;${item.info.serialization}</li>
    </ul>
    <!-- /wp:list -->`
    }

    function generateStructuredData(items) {
        const openTagScript = '<script type="application/ld+json">'
        const closeTagScript = '</script>'
        let arrStructuredData = []

        for (let i = 0; i < items.length; i++) {
            arrStructuredData.push(items[i].structuredData)
        }

        const structuredDataContent = openTagScript + JSON.stringify(arrStructuredData) + closeTagScript

        fs.writeFileSync(`./content/${content.dirName}/dados-estruturados.txt`, structuredDataContent)
    }

}

module.exports = robotFormat