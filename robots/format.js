const state = require('./state')

async function robotFormat () {
  console.log('\n> [text-format] Start...\n')
  const content = state.load()

  await generateStructure(content.items)

  console.log('[robot-format] Formatação concluida')

  state.save(content)
  console.log('\n> [format-robot] Stop...\n')

  async function generateStructure (item) {
    let structureContent = ''
    let list = ''

    const tableNames = await generateTableNames(content.items)

    for (let i = 0; i < item.length; i++) {
      console.log(`\n> [format-robot] [${i + 1}] [${item[i].name}] Formatando...\n`)
      const title = `<!-- wp:heading -->\n<h2>${item[i].name}</h2>\n<!-- /wp:heading -->`
      const image = `<!-- wp:image {"align":"wide","sizeSlug":"large"} -->
<figure class="wp-block-image alignwide size-large"><img src="${item[i].imgPath.replace(/ /g, '')}?" alt="${item[i].name}"/><figcaption>${item[i].name}</figcaption></figure>
<!-- /wp:image -->`

      if (content.type === 'anime' || content.type === 'custom') {
        list = await animeInfoStructure(item[i])
      } else if (content.type === 'manga') {
        list = await mangaInfoStructure(item[i])
      }

      const linesSynopsis = item[i].synopsis.split('. ')
      const removeLastParagraph = `<!-- wp:paragraph -->\n<p>${linesSynopsis.join('.</p>\n<!-- /wp:paragraph -->\n<!-- wp:paragraph -->\n<p>')}`
      const synopsis = removeLastParagraph.substring(0, removeLastParagraph.lastIndexOf('<!--'))

      structureContent = `${structureContent}${title}\n${image}\n${list}\n<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":4} -->
<h4>Sinopse:</h4>
<!-- /wp:heading -->\n${synopsis}<!-- wp:separator {"color":"quaternary"} -->
<hr class="wp-block-separator has-text-color has-background has-quaternary-background-color has-quaternary-color"/>
<!-- /wp:separator -->`
    }

    content.wpContent = `${tableNames} ${structureContent}`
  }

  async function generateTableNames (item) {
    const head = '<!-- wp:columns --><div class="wp-block-columns"><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph {"align":"left"} --><p class="has-text-align-left"><strong>Nome em inglês</strong></p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>'

    const thisNameEnglish = []
    for (let i = 0; i < item.length; i++) {
      const verifyExist = item[i].info.nameEnglish.length === 0 ? '---' : item[i].info.nameEnglish
      thisNameEnglish.push(`<li>${verifyExist}</li>`)
    }

    const mid = '</ol><!-- /wp:list --></div><!-- /wp:column --><!-- wp:column --><div class="wp-block-column"><!-- wp:paragraph {"align":"left"} --><p class="has-text-align-left"><strong>Nome em japonês</strong></p><!-- /wp:paragraph --><!-- wp:list {"ordered":true} --><ol>'

    const thisNameJapanese = []
    for (let i = 0; i < item.length; i++) {
      const verifyNameJapanese = item[i].info.nameEnglish.indexOf(item[i].name) !== -1 ? '---' : item[i].name
      thisNameJapanese.push(`<li>${verifyNameJapanese}</li>`)
    }

    const foot = '</ol><!-- /wp:list --></div><!-- /wp:column --></div><!-- /wp:columns --><!-- wp:separator --><hr class="wp-block-separator"/><!-- /wp:separator -->'

    return head + thisNameEnglish.join('\n') + mid + thisNameJapanese.join('\n') + foot
  }

  async function animeInfoStructure (item) {
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

  async function mangaInfoStructure (item) {
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
}

module.exports = robotFormat
