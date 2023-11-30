# Base Express Web App
Special for Test task from HeadHunter

## Установка

```bash
$ npm install
```
```bash
$ yarn install
```
## Запуск приложения

```bash
$ npm run start:public
```
```bash
$ yarn start:public
```

## API

````
Для снятие баланса:

POST: {{HOST}}:3000/api/balance/subtract

RAW Body:
{
    "id": Number,
    "amount": Number
}
Для начисление баланса:

POST: {{HOST}}:3000/api/balance/add

RAW Body:
{
    "id": Number,
    "amount": Number
}
