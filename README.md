PASSOS DE INSTALAÇÃO E EXECUÇÃO:

INSTALAÇÃO DO NODE:
npm init -y
npm install typescript ts-node --save-dev
npx tsc --init

INSTALAÇÃO DE BIBLIOTECA E TIPAGEM PARA NODE (LÊ INPUT DO USUARIO NO TERMINAL):
npm install @types/node --save-dev
npm install --save-dev @types/prompt-sync
npm install prompt-sync

INSTALAÇÃO DE BIBLIOTECA PARA BD SQLITE:
npm install better-sqlite3

PARA TESTAR O API REST INSTALAR A EXTENSÃO 'REST CLIENTE' NO VSCODE

PARA EXECUTAR:
ABRIR TERMINAL INTEGRADO NO ARQUIVO INTERFACE.TS
npx ts-node Interface.ts

PARA EXECUTAR EM API:
ABRIR TERMINAL INTEGRADO NO ARQUIVO SERVER.TS
INICIALIZA O SERVIDOR: npm run start:api

PARA FACILITAR OS TESTES: No arquivo api-testes.http, é possível testar as funções do código,
instalando a extensão 'Rest Client' no vscode e clicando em 'Send Request' acima de cada comando
do arquivo.
