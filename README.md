# APISAL

A API oficial do Alonsal, usada como base de dados de vários comandos de forma mais prática e direta

O retorno da mesma é usada em webhooks no Discord, porém pode ser usada de outras formas também<br>
Seus retornos são `nome`, `foto` e um `texto` como conteúdos dinâmicos, estes, com controle de repetição

URL's ofertadas:
<br>`/cantadas` - Cantadas do Vai dar Namoro
<br>`/jailson` - Frases clássicas do Pai da Delícia
<br>`/rasputia` - Frases da rasputia, tudo numa boa!
<br>`/textoes` - Frases de shitpost

Exemplos de retorno :: <br>
`apisal.herokuapp.com/cantadas`

```
{
     "nome":"Vai dar namoro",
     "foto":"url_de_uma_foto",
     "texto":"Você é mimada?? Hmmmm me apaixonei"
}
```

<hr>

`apisal.herokuapp.com/jailson`

```
{
     "nome":"Jailson Mendes",
     "foto":"url_de_uma_foto",
     "texto":"Essa API que você queria?"
}
```
