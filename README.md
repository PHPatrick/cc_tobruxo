# Create Content For ToBruxo

## Começando

Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

Se trata de um software para capturar informações de animes. Gerar uma estrutura de conteúdo e dados estruturados para criação de um artigo no WordPress.

------

## Pré-requesitos

O que você precisa para instalar o software e como instalá-lo
* [Node.JS](https://nodejs.org/en/)
* [ImageMagick](https://imagemagick.org/)
* [npm](https://www.npmjs.com/)

### API's
* [Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest/)
* [Custom Search API](https://developers.google.com/custom-search/v1/overview)

#### Pré-requesitos para o Custom Search API
* [Search Engine ID](https://cse.google.com/cse/all)

------

## Node.JS e npm

### Testando o Node.JS

Para a instalação do Node, acesse [https://nodejs.org/](https://nodejs.org/en/) e faça download da versão LTS (recomendado).

Após a instalação, execute o seguinte comando no seu terminal / cmd:

#### Windows
````
node --version
````

#### Linux, MacOS
````
node -v
````

Deverá retornar algo parecido com isto:
```
v12.12.0
```
------
### Testando o npm

Além do Node, também é necessário o [npm](https://www.npmjs.com/), mas não se preocupe, normalmente ele vem junto com a instalação do Node. Para testá-lo, execute este comando:

#### Windows
````
npm --version
````

#### Linux, MacOS
````
npm -v
````

Deverá retornar algo parecido com isto:
```
6.13.4
```
------

## ImageMagick

Iremos utilizar o ImageMagick para tratar e redimensionar as imagens.

### Instalando o ImageMagick

### Windows
Acesse o site oficial do ImageMagick: [https://imagemagick.org/script/download.php#windows](https://imagemagick.org/script/download.php#windows)

Selecione a primeira opção (mais atualizada) do HTPP, após baixar o instalador, abra-o e siga os processos de instalação, quando chegar em uma tela de seleção de checkboxs, recomendo que você habilite todos (caso não queira, habilite somente a opção que contém a palavra "convert"), e prossiga com a instalação.

⠀⠀⠀⠀⠀⠀⠀⠀⠀

### MacOS
Para o MacOS a maneira mais fácil é utilizando o Homebrew, para instala-lo, execute o comando abaixo em seu terminal.
```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

Agora utilize este comando para instalar o ImageMagick
```
brew install imagemagick
```

O ImageMagick depende das fontes Ghostscript. Para instalá-los, digite:
```
brew install ghostscript
```

⠀⠀⠀⠀⠀⠀⠀⠀⠀

### Linux

* [Documentação oficial ImageMagick para Unix](https://imagemagick.org/script/download.php#unix)

⠀⠀⠀⠀⠀⠀⠀⠀⠀

### Testando o funcionamento do ImageMagick

Quando o processo de instalação for concluido, para testar se o Image Magick está funcionando corretamente, digite o seguinte comando no seu terminal / cmd:
````
convert -version
````
Deverá retornar algo parecido com isso:
```
Version: ImageMagick 7.0.9-8 Q16 x86_64 2019-12-09 https://imagemagick.org
Copyright: © 1999-2020 ImageMagick Studio LLC
License: https://imagemagick.org/script/license.php
Features: Cipher DPC HDRI Modules OpenMP(3.1) 
Delegates (built-in): bzlib freetype heic jng jp2 jpeg lcms ltdl lzma openexr png tiff webp xml zlib
```
------

### API's

Após pegar a API key do Cloud Translation e Custom Search, e o Search Engine ID adicione-os nos arquivos da pasta ```/keys```

Caso esteja com dificuldades, assista esses vídeos, mostrando passo-a-passo para adquirir as API Keys e o Search Engine ID.
* [Video tutorial: API KEY Cloud Translation](https://youtu.be/nIVLmaavks0)
* [Video tutorial: API KEY Custom Search & ID Search Engine](https://youtu.be/quGA-U5B0iU)
* [Video tutorial: Testando o funcionamento das API's](https://youtu.be/8q7qLhwZqzw)

------
### Instalando

Primeiramente, clone o repositório em sua máquina.

Comando para clonar:

````
git clone https://github.com/gabzedine/cc_tobruxo.git
````

Após isso, acesse o repositório em sua máquina, e execute o seguinte comando:

````
npm install
````

Este comando irá instalar todas as dependências necessárias para execução do programa

### Iniciando

Para iniciar o programa, basta utilizar o comando:

````
npm start
````

E responder as questões que irão ser perguntadas para a conclusão da criação do artigo.

* [Vídeo mostrando a utilização do programa](https://youtu.be/D07xN42y4sw)
