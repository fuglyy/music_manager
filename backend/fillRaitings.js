const db = require('./db/db').getConnection();

db.all('SELECT id FROM songs', (err, rows) => {
  if (err) return console.error('Ошибка выборки песен:', err.message)

  rows.forEach(({ id }) => {
    const randomRating = Math.floor(Math.random() * 100) + 1 // от 1 до 100
    db.run('UPDATE songs SET rating = ? WHERE id = ?', [randomRating, id], (err) => {
      if (err) console.error(`Ошибка обновления рейтинга для песни ${id}:`, err.message)
    })
  })

  console.log('🎵 Рейтинги успешно проставлены!')
})
