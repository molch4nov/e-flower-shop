const Review = require('../models/review');
const File = require('../models/file');
const logger = require('pino')({ name: 'review-controller' });

exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.getAll();
    res.json(reviews);
  } catch (error) {
    logger.error(error, 'Ошибка при получении отзывов');
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};

exports.getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.getById(id);

    if (!review) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }

    res.json(review);
  } catch (error) {
    logger.error(error, 'Ошибка при получении отзыва');
    res.status(500).json({ error: 'Ошибка при получении отзыва' });
  }
};

exports.getReviewsByParent = async (req, res) => {
  try {
    const { parent_id } = req.params;
    const reviews = await Review.getByParent(parent_id);
    res.json(reviews);
  } catch (error) {
    logger.error(error, 'Ошибка при получении отзывов');
    res.status(500).json({ error: 'Ошибка при получении отзывов' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { title, description, rating, parent_id } = req.body;

    // Проверка обязательных полей
    if (!title || !description || !rating || !parent_id) {
      return res.status(400).json({ 
        error: 'Заголовок, описание, рейтинг и parent_id обязательны' 
      });
    }

    // Проверка рейтинга
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Рейтинг должен быть числом от 1 до 5' });
    }

    const reviewData = {
      title,
      description,
      rating: ratingNum,
      parent_id,
    };

    const newReview = await Review.create(reviewData);
    res.status(201).json(newReview);
  } catch (error) {
    logger.error(error, 'Ошибка при создании отзыва');
    res.status(500).json({ error: 'Ошибка при создании отзыва' });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, rating, parent_id } = req.body;

    // Проверка обязательных полей
    if (!title || !description || !rating || !parent_id) {
      return res.status(400).json({ 
        error: 'Заголовок, описание, рейтинг и parent_id обязательны' 
      });
    }

    // Проверка рейтинга
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Рейтинг должен быть числом от 1 до 5' });
    }

    const reviewData = {
      title,
      description,
      rating: ratingNum,
      parent_id,
    };

    const updatedReview = await Review.update(id, reviewData);

    if (!updatedReview) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }

    // Получаем файлы для обновленного отзыва
    updatedReview.files = await File.getByParent(id);

    res.json(updatedReview);
  } catch (error) {
    logger.error(error, 'Ошибка при обновлении отзыва');
    res.status(500).json({ error: 'Ошибка при обновлении отзыва' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReview = await Review.delete(id);

    if (!deletedReview) {
      return res.status(404).json({ error: 'Отзыв не найден' });
    }

    res.json({
      message: 'Отзыв успешно удален',
      review: deletedReview
    });
  } catch (error) {
    logger.error(error, 'Ошибка при удалении отзыва');
    res.status(500).json({ error: 'Ошибка при удалении отзыва' });
  }
}; 