function robotFormat(animes) {
    let content = ""
    for (let i = 0; i < animes.length; i++) {

        const title = `<!-- wp:heading -->\n<h2>${animes[i].name}</h2>\n<!-- /wp:heading -->`
        const image = `<!-- wp:image {"align":"wide"} -->\n<figure class="wp-block-image alignwide"><img alt="" /></figure>\n<!-- /wp:image -->`
        const list = `<!-- wp:list -->
    <ul>
        <li><strong>Nome em Inglês: </strong>&nbsp;${animes[i].info.nameEnglish}<br><strong>Nome em Japonês: ${animes[i].info.nameJapanese}</strong></li>
        <li><strong>Gênero:</strong>&nbsp;${animes[i].info.nameEnglish}</li>
        <li><strong>Episódios:</strong>&nbsp;${animes[i].info.genres}</li>
        <li><strong>Exibido:</strong>&nbsp;${animes[i].info.aired}</li>
        <li><strong>Estúdio:</strong>&nbsp;${animes[i].info.studios}</li >
        <li><strong>Trailer:</strong>&nbsp;${animes[i].info.trailer}</li >
        <li><strong>Onde Assistir:</strong>&nbsp;${animes[i].info.watch}</li>
    </ul>
    <!-- /wp:list -->`


        const linesSynopsis = animes[i].synopsis.split(".")
        const removeLastParagraph = `<!-- wp:paragraph -->\n<p>${linesSynopsis.join(".</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>")}`

        const synopsis = removeLastParagraph.substring(0, removeLastParagraph.lastIndexOf("<!--"));


        content = content + `${title}\n${image}\n${list}\n${synopsis}<!-- wp:separator {"color":"quaternary"} -->
<hr class="wp-block-separator has-text-color has-background has-quaternary-background-color has-quaternary-color"/>
<!-- /wp:separator -->`
    }

    return content
}

module.exports = robotFormat