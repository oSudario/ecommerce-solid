// Garante que o arquivo SQLite exista antes de aplicar as migrações.
const fs = require('node:fs');
const path = require('node:path');
const database = path.join(__dirname, '..', 'prisma', 'dev.db');
fs.closeSync(fs.openSync(database, 'a'));
