const imageDownloader = require("image-downloader");
const fs = require('fs');
const gm = require("gm").subClass({
    imageMagick: true
})
const google = require("googleapis").google;
const customSearch = google.customsearch("v1");
const state = require("./state.js");

const googleSearchCredentials = require("../keys/google-search.json");

async function imageRobot() {
    console.log('\n> [image-robot] Start...')
    const content = state.load()
    console.log('\n> [image-robot] Imagens sendo baixadas, aguarde...\n')
    await fetchImageOfAllNames(content)
    await downloadAllImages(content);
    await convertAllImages(content)

    state.save(content);
    console.log('\n> [image-robot] Stop...\n')

    async function fetchImageOfAllNames(content) {
        for (const item of content.items) {
            const query = `${item.name} wallpaper`;
            item.images = await returnImagesLinks(query);

            item.googleSeachQuery = query;
        }
    }

    async function returnImagesLinks(query) {
        const response = await customSearch.cse.list({
            auth: googleSearchCredentials.apiKey,
            cx: googleSearchCredentials.searchEngineId,
            q: query,
            searchType: "image",
            // imgSize: "large",
            num: 2
        });

        const imagesUrl = response.data.items.map(item => {
            return item.link;
        });

        return imagesUrl;
    }

    async function downloadAllImages(content) {
        content.downloadedImages = [];

        for (let itemIndex = 0; itemIndex < content.items.length; itemIndex++) {
            const images = content.items[itemIndex].images;
            let nameItem = content.items[itemIndex].name.normalize('NFD').replace(/([\u0300-\u036f\s]|[^0-9a-zA-Z\s])/g, '_').toLowerCase()

            for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
                const imageUrl = images[imageIndex];

                try {
                    if (content.downloadedImages.includes(imageUrl)) {
                        throw new Error("> [image-robot] Imagem ja foi baixada");
                    }
                    await downloadAndSaveImage(imageUrl, `${itemIndex+1}-${nameItem}-original.jpg`);
                    content.downloadedImages.push(imageUrl);
                    console.log(
                        `> [image-robot] [${itemIndex+1}] [${imageIndex}] Baixou imagem com sucesso: ${imageUrl}\n`
                    );
                    break;
                } catch (error) {
                    console.log(
                        `> [image-robot] [${itemIndex+1}] [${imageIndex}] Erro ao baixar (${imageUrl}): ${error}\n`
                    );
                }
            }
        }
    }

    async function downloadAndSaveImage(url, fileName) {
        return imageDownloader.image({
            url,
            url,
            dest: `./content/${content.dirName}/${fileName}`
        });
    }

    async function convertAllImages(content) {
        for (let itemIndex = 0; itemIndex < content.items.length; itemIndex++) {
            let nameItem = content.items[itemIndex].name.normalize('NFD').replace(/([\u0300-\u036f\s]|[^0-9a-zA-Z\s])/g, '_').toLowerCase()
            await convertImage(itemIndex + 1, nameItem, content.dirName, content)
            deleteOriginalImage(itemIndex + 1, nameItem, content.dirName)
        }
    }

    async function convertImage(itemIndex, nameItem, dirName, content) {
        return new Promise((resolve, reject) => {
            const nameImgConverted = `${itemIndex}-${nameItem}-${dirName}.jpg`

            const data = new Date();
            const year = data.getFullYear();
            const month = data.getMonth() + 1;

            content.items[itemIndex - 1].imgPath = `https://tobruxo.com.br/wp-content/uploads/${year}/${month}/${nameImgConverted}`

            const inputFile = `./content/${dirName}/${itemIndex}-${nameItem}-original.jpg[0]`
            const outputFile = `./content/${dirName}/${nameImgConverted}`
            const width = 1250
            const height = 700

            gm()
                .in(inputFile)
                .out('-define', 'jpeg:extent=90kb')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-blur', '0x9')
                .out('-resize', `${width}x${height}^`)
                .out(')')
                .out('(')
                .out('-clone')
                .out('0')
                .out('-background', 'white')
                .out('-resize', `${width}x${height}`)
                .out(')')
                .out('-delete', '0')
                .out('-gravity', 'center')
                .out('-compose', 'over')
                .out('-composite')
                .out('-extent', `${width}x${height}`)
                .write(outputFile, (error) => {
                    if (error) {
                        return reject(error)
                    }

                    console.log(`> [image-robot] Image converted: ${inputFile}`)
                    resolve()
                })
        })
    }

    function deleteOriginalImage(itemIndex, nameItem, dirName) {
        const filePath = `./content/${dirName}/${itemIndex}-${nameItem}-original.jpg`;
        fs.unlinkSync(filePath);
    }
}

module.exports = imageRobot