# Create Content For ToBruxo

## Começando

Essas instruções fornecerão uma cópia do projeto em execução na sua máquina local para fins de desenvolvimento e teste.

### Pré-requesitos

O que você precisa para instalar o software e como instalá-lo
* [Node.JS](https://nodejs.org/en/)
* [ImageMagick](https://imagemagick.org/)


#### Testando
````
node -v
````
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
* [Video tutorial API KEY Cloud Translation](https://cloud.google.com/translate/docs/reference/rest/)
* [Video tutorial API KEY Custom Search & ID Search Engine](https://developers.google.com/custom-search/v1/overview)

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
