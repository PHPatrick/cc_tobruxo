const robots = {
  input: require('./robots/input'),
  search: require('./robots/search'),
  text: require('./robots/text'),
  image: require('./robots/image'),
  format: require('./robots/format'),
  save: require('./robots/save')
}

async function start () {
  // Robot responsible for capturing user inputs
  await robots.input()

  // Robot responsible for fetching and capturing urls
  await robots.search()

  // Robot responsible for capturing, formatting and translating the text of content
  await robots.text()

  // Robot responsible for fetching and downloads images
  await robots.image()

  // Robot responsible for formatting content [ wp-content ]
  await robots.format()

  // Robot responsible for save the text contents [ wp-content.txt, dados-estruturados.txt ]
  await robots.save()
}

start()
