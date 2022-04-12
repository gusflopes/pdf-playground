# CTOOLS: Comprovantes Bancários

Sistema de análise e interpretação de comprovantes bancários que, eventualmente, poderá evoluir para um sistema de conciliação bancária.

## Funcionalidades

Micro-serviço para fazer upload de arquivos PDF (Comprovantes Bancários) a fim de extrair as informações do PDF e gerar planilha acessória para conciliação bancária.
O objetivo é que o sistema seja utilizado para geração de planilhas a partir dos comprovantes, permitindo a simplificação da conciliação bancária que será feita ao analisar o Extrato Bancário também em planilha, mas gerada pelo Banco.
**Atualmente não existe nenhum controle de duplicidade, exceto pela organização em lotes. Em caso de envio de dois lotes com comprovantes na mesma data, o sistema salvará ambos os comprovantes, mas eles estarão vinculados à um lote específico.**
_Pode ser interessante permitir o envio dos comprovantes, independente da possibilidade de sua interpretação, permitindo assim ao Contador analisar os comprovantes de forma manual. Neste caso o sistema pode evoluir para um serviço de cobrança de arquivos, evoluindo inclusive para outros tipos de arquivos como Extratos Bancários, se tornando um sistema de conciliação_

### Requisitos Técnicos

- Cadastrar Usuário
- Fazer Login
- Cadastrar Conta
- Fazer upload de comprovantes (PDF + JSON) selecionando um PARSER em lote
- SISTEMA: Cadastrar Receipts e os respectivos arquivos PDF extraindo informações do PDF
- Permitir alteração dos dados do Receipt
- Gerar Link do arquivo
- Gerar planilha Excel dos Receipts por Lote

### Regras de Negócio

- Permitido criar batches apenas após criar uma conta
- Receipts e Files apenas com soft delete
- Batch permite hard delete, deletando tb receipts e files

## Rotas

As rotas que serão utilizadas pelo micro-serviços estão relatadas adiante. No primeiro momento serão apenas as **User Routes**, sendo que o objetivo das

### User Routes

/account
/account/:id/batches [Upload de receipts em lote ** com arquivo || List batches || Get batch with transactions]
/account/:id/receipts [As informações do recibo]
/account/:id/receipts/:id/files [Download do arquivo]
/receipts [Para acessar receipts de todas as contas]

### Support Routes

**A definir**
O objetivo é criar rotas de suporte, permitindo que os usuários participem no processo de criação de novos parsers e funcionalidades, permitindo o envio de arquivos de exemplo para desenvolvimento de novos parses
Uma ideia é que toda falha no parser gere um novo ticket, permitindo que o usuário complemente com as informações, além de enviar os arquivos para desenvolvimento de novos parsers.

### Admin Routes

/receipts
?user_id
?account_id
?batch_id
?bank_code
?start_date
?end_date
/users
/users/:id/accounts
/users/:id/batches
