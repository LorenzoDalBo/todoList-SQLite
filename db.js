import * as SQLite from 'expo-sqlite' ;
const DATABASE_NAME = "exemploApp.sqlite";
const SQL_CREATE_ENTRIES = `
CREATE TABLE IF NOT EXISTS todo_list (
id INTEGER PRIMARY KEY autoincrement,
todoTitle varchar(255) NOT NULL,
todoText varchar(255) NOT NULL
)
` ;
let db = null ;
export default function openDB() {
if (!db) {
db = SQLite.openDatabaseSync(DATABASE_NAME);

db.withTransactionSync (() => {
db.execSync(SQL_CREATE_ENTRIES);
});
}





return db;
}