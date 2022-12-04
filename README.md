# APISAL

A API oficial do Alonsal, usada como base de dados de vários comandos de forma mais prática e direta

Os retornos são com base em chaves num JSON, e seu conteúdo pode ser facilmente utilizado<br>
Seus retornos são `nome`, `foto` e um `texto` (em alguns comandos) com conteúdos dinâmicos, estes, com controle de repetição

URL's ofertadas:
<br>`/random?cantadas` - Cantadas do Vai dar Namoro
<br>`/random?jailson` - Frases clássicas do Pai da Delícia
<br>`/random?rasputia` - Frases da rasputia, tudo numa boa!
<br>`/random?textoes` - Frases de shitpost
<br>`/curiosidades` - Curiosidades aleatórias
<br>`/history` - Acontecimentos de uma data

Exemplos de retorno :: <br>
`{url_api}/random?cantadas`

```
{
     "nome": "Vai dar namoro",
     "foto": "url_de_uma_foto",
     "texto": "Você é mimada?? Hmmmm me apaixonei"
}
```

<hr>

`{url_api}/random?jailson`

```
{
     "nome": "Jailson Mendes",
     "foto": "url_de_uma_foto",
     "texto": "Essa API que você queria?"
}
```

<hr>

Abaixo um outro exemplo de outro campo de retorno

`{url_api}/curiosidades`

```
{
     "nome": "Curiosidade",
     "foto": "url_de_uma_foto_de_capa",
     "texto": "Uma curiosidade aleatória",
     "img_curio": "url_de_uma_foto_relacionada_a_curiosidade"
}
```

<hr>
<h2>History</h2>

A URL do History oferta todos os acontecimentos registrados num dia especificado, com a possibilidade
de receber um acontecimento em uma data especificada, ou na data atual de forma aleatória ou não.<br>


Seus paramêtros de entrada podem ser estes `data`, `lang` e `acon`, seus valores padrões são
respectivamente, `data atual`, `pt-br` e `lista` caso não sejam especificados, abaixo seguem exemplos de uso e retornos esperados:

`{url_api}/history`

Neste caso será enviado uma lista com todos os acontecimentos do dia atual, no idioma pt-br

```
[
     {
          "acontecimento": "O titulo do acontecimento",
          "data_acontecimento": "A data em string",
          "fonte": "O link para a matéria",
          "ano": 0000
     },
     {
          "acontecimento": "O titulo do acontecimento",
          "data_acontecimento": "A data em string",
          "fonte": "O link para a matéria",
          "ano": 0000
     },
     .
     .
     .
]
```

<hr>

`{url_api}/history?data=21/01`

Será enviado uma lista com todos os acontecimentos do dia 21/01
```
[
     {
          "acontecimento": "O titulo do acontecimento",
          "data_acontecimento": "A data em string",
          "fonte": "O link para a matéria",
          "ano": 0000
     },
     {
          "acontecimento": "O titulo do acontecimento",
          "data_acontecimento": "A data em string",
          "fonte": "O link para a matéria",
          "ano": 0000
     },
     .
     .
     .
]
```

<hr>

`{url_api}/history?acon=2`

Será retornado o 2° acontecimento da lista de acontecimentos do dia atual
```
{
     "acontecimento": "O titulo do acontecimento",
     "data_acontecimento": "A data em string",
     "fonte": "O link para a matéria",
     "ano": 0000,
     "descricao": "Uma descrição do acontecimento",
     "imagem": "Uma imagem do acontecimento"
}
```

<hr>

`{url_api}/history?acon=alea`

Será retornado um acontecimento aleatório dos acontecimentos do dia atual
```
{
     "acontecimento": "O titulo do acontecimento",
     "data_acontecimento": "A data em string",
     "fonte": "O link para a matéria",
     "ano": 0000,
     "descricao": "Uma descrição do acontecimento",
     "imagem": "Uma imagem do acontecimento"
}
```

<hr>

`{url_api}/history?acon=2&data=21/01`

Será retornado o 2° acontecimento da lista de acontecimentos do dia 21/01
```
{
     "acontecimento": "O titulo do acontecimento",
     "data_acontecimento": "A data em string",
     "fonte": "O link para a matéria",
     "ano": 0000,
     "descricao": "Uma descrição do acontecimento",
     "imagem": "Uma imagem do acontecimento"
}
```
