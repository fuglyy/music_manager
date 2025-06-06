const sqlite3 = require('sqlite3').verbose();
const path = require('path');

let instance = null;

class Database {
  constructor() {
    if (!instance) {
      this.db = new sqlite3.Database(path.resolve(__dirname, 'music.db'), (err) => {
        if (err) console.error('Ошибка подключения к базе данных:', err);
        else console.log('База данных подключена');
      });

      this.initTables(); // вызываем создание таблиц
      instance = this;
    }
    return instance;
  }

  getConnection() {
    return this.db;
  }

  initTables() {
    const db = this.db;

    // Таблица групп
    db.run(`CREATE TABLE IF NOT EXISTS groups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      year INTEGER,
      country TEXT,
      ownerId INTEGER
    )`);

    // Таблица участников
    db.run(`CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      surname TEXT,
      instrument TEXT,
      role TEXT,
      joinDate TEXT,
      groupID INTEGER,
      FOREIGN KEY (groupID) REFERENCES groups(id) ON DELETE CASCADE
    )`);

    // Таблица альбомов
    db.run(`CREATE TABLE IF NOT EXISTS albums (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      releaseDate TEXT,
      groupID INTEGER,
      FOREIGN KEY (groupID) REFERENCES groups(id) ON DELETE CASCADE
    )`);

    // Таблица песен
    db.run(`CREATE TABLE IF NOT EXISTS songs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      composer TEXT,
      lyricist TEXT,
      year INTEGER,
      singer TEXT,
      rating INTEGER,
      groupID INTEGER,
      albumID INTEGER,
      FOREIGN KEY (groupID) REFERENCES groups(id) ON DELETE CASCADE,
      FOREIGN KEY (albumID) REFERENCES albums(id) ON DELETE CASCADE
    )`);

    // Таблица городов
    db.run(`CREATE TABLE IF NOT EXISTS cities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )`);

    // Таблица туров
    db.run(`CREATE TABLE IF NOT EXISTS tours (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      groupID INTEGER,
      name TEXT,
      startDate TEXT,
      endDate TEXT,
      avgPrice REAL,
      FOREIGN KEY (groupID) REFERENCES groups(id) ON DELETE CASCADE
    )`);

    // Таблица связи туров и городов
    db.run(`CREATE TABLE IF NOT EXISTS tourCities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tourID INTEGER,
      cityID INTEGER,
      date TEXT,
      ticketPrice REAL,
      FOREIGN KEY (tourID) REFERENCES tours(id) ON DELETE CASCADE,
      FOREIGN KEY (cityID) REFERENCES cities(id) ON DELETE CASCADE
    )`);

    // Таблица пользователей
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('manager', 'admin')) NOT NULL DEFAULT 'manager'
    )`);
  }
}

module.exports = new Database();
