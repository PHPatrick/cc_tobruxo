# Create Content For ToBruxo

## Começando

Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

## Pré-requesitos

O que você precisa para instalar o software e como instalá-lo
* [Node.JS](https://nodejs.org/en/)
* [ImageMagick](https://imagemagick.org/)


## Instalando ImageMagick

### Windows
Acesse o site oficial do ImageMagick: [https://imagemagick.org/script/download.php#windows](https://imagemagick.org/script/download.php#windows)
Selecione a primeira opção (mais atualizada) do HTPP, após baixar o instalador, abra-o e siga os processos de instalação, quando chegar em uma tela de seleção de checkboxs, recomendo que você habilite todos.

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

### Linux

* [Documentação oficial](https://imagemagick.org/script/download.php)

------

#### Testando
##### Node.JS
````
node -v
````

##### ImageMagick
````
convert -version
````
------
### API's
* [Cloud Translation API](https://cloud.google.com/translate/docs/reference/rest/)
* [Custom Search API](https://developers.google.com/custom-search/v1/overview)

#### Pré-requesitos para API's
* [Search Engine ID](https://cse.google.com/cse/all)

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
