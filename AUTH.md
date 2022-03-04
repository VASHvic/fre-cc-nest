- npm i --save class-validator class-transformer -> aplicar transformacions y validacions de tipo al dto

- necesita que el dto siga class, no interface
- afegir en main.ts -> app.useGlobalPipes(
  new ValidationPipe({
  whitelist: true,
  }),); // antes de listen

- encriptació: npm i argon2

---

JWT

- npm install --save @nestjs/passport passport
- npm install --save @nestjs/jwt passport-jwt
- npm install --save-dev @types/passport-jwt
