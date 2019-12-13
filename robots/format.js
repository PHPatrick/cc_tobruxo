function robotFormat(anime) {
    const title = `<!-- wp:heading -->\n<h2>${anime.name}</h2>\n<!-- /wp:heading -->`
    const image = `<!-- wp:image {"align":"wide"} -->\n<figure class="wp-block-image alignwide"><img alt="" /></figure>\n<!-- /wp:image -->`
    const list = `<!-- wp:list -->
    <ul>
        <li><strong>Nome em Inglês: </strong>&nbsp;${anime.info.nameEnglish}<br><strong>Nome em Japonês: ${anime.info.nameJapanese}</strong></li>
        <li><strong>Gênero:</strong>&nbsp;${anime.info.nameEnglish}</li>
        <li><strong>Episódios:</strong>&nbsp;${anime.info.genres}</li>
        <li><strong>Exibido:</strong>&nbsp;${anime.info.aired}</li>
        <li><strong>Estúdio:</strong>&nbsp;${anime.info.studios}</li >
        <li><strong>Trailer:</strong>&nbsp;${anime.info.trailer}</li >
        <li><strong>Onde Assistir:</strong>&nbsp;${anime.info.watch}</li>
    </ul>
    <!-- /wp:list -->`


    const linesSynopsis = anime.synopsis.split(".")
    const removeLastParagraph = `<!-- wp:paragraph -->\n<p>${linesSynopsis.join(".</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>")}`

    const synopsis = removeLastParagraph.substring(0, removeLastParagraph.lastIndexOf("<!--"));


    const content = `${title}\n${image}\n${list}\n${synopsis}`

    return content
}

module.exports = robotFormat