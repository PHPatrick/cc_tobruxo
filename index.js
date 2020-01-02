const robots = {
  input: require('./robots/input'),
  search: require('./robots/search'),
  text: require('./robots/text'),
  image: require('./robots/image'),
  format: require('./robots/format'),
  save: require('./robots/save')
}

async function start () {
  // Robô responsável por capturar os inputs do usuário
  await robots.input()

  // Robô responsável por buscar e capturar as urls
  await robots.search()

  // Robô responsável por capturar, formatar e traduzir o conteúdo de texto
  await robots.text()

  // Robô responsável por buscar e baixar as imagens
  await robots.image()

  // Robô responsável pela formatação do conteúdo [ wp-content ]
  await robots.format()

  // Robô responsável por salvar os conteúdos de texto [ wp-content.txt, dados-estruturados.txt ]
  await robots.save()
}

start()
