# unread-email-downloader
Esse repositório trata-se de baixar emails não lidos com a anexos .xml


## Como Rodar o Projeto

Siga as instruções abaixo para rodar o projeto em seu ambiente local:

1. **Instale o Node.js:**
   Certifique-se de ter o Node.js instalado em sua máquina. Você pode baixá-lo em [https://nodejs.org/](https://nodejs.org/).

2. **Instale o Docker:**
   Certifique-se de ter o Docker instalado em sua máquina. Você pode baixá-lo em [https://www.docker.com/get-started/](https://www.docker.com/get-started/).

3. **Clone o Repositório:**
   ```bash
   git clone https://github.com/brunosbrito/unread-email-downloader.git
   cd unread-email-downloader

4. **Instale as Dependências:**
    Execute o seguinte comando para instalar as dependências do projeto:
    ```bash
    npm install
    
4. **Rode o Docker::**
    Use o Docker Compose para construir e iniciar os containers do projeto:
    ```bash
        docker-compose up --build
        
## Documentação
**Buscar Emails Não Lidos com Anexos .xml**
Para buscar os emails não lidos que contenham anexos .xml, siga as instruções abaixo:
Tipo de Requisição: POST
URL: http://localhost:3000/getDocuments
Corpo da Requisição (PAYLOAD)    

    ```bash
        {
          "host": "",
          "port": ,
          "email": "",
          "password": ""
        }
        
**Consultar Informações do Documento por Nome de Arquivo**
Para consultar informações de um documento específico pelo nome do arquivo, utilize o seguinte endpoint:
Tipo de Requisição: GET
URL: http://localhost:3000/getInfoDocument/{fileName}
Por exemplo, ao consultar um arquivo chamado example.xml, a resposta será:
   

     ```bash 
            {
              "date":  "2024-05-22T02:48:04.989Z",
              "filename": "NFe.xml",
              "contentFile": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><nfeProc"
            }
        
