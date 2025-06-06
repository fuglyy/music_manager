const analyticsModel = require('../models/analyticsModel');

exports.getTopSongs = async (req, res) => {
  try {
    const rows = await analyticsModel.getTopSongs();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getComposerStats = async (req, res) => {
  try {
    const rows = await analyticsModel.getComposerStats();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getSongYearsStats = async (req, res) => {
  try {
    const rows = await analyticsModel.getSongYearsStats();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.refreshRatings = async (req, res) => {
  try {
    await analyticsModel.refreshRatings();
    res.json({ message: 'Рейтинги успешно обновлены' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка при обновлении рейтингов: ' + err.message });
  }
};

