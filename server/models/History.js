const db = require('../db');

class History {
  static async create(historyData) {
    return await db('histories').insert(historyData);
  }

  static async upsert(historyData) {
    return await db('histories')
      .insert(historyData)
      .onConflict(['symbol', 'user_id', 'range', 'model'])
      .merge();
  }

  static async findAll(limit = 20) {
    return await db('histories')
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  static async findById(id) {
    return await db('histories').where({ id }).first();
  }

  static async findByUserId(userId, limit = 20) {
    return await db('histories')
      .where({ user_id: userId })
      .orderBy('created_at', 'desc')
      .limit(limit);
  }

  static async updateNote(id, note) {
    return await db('histories').where({ id }).update({ note });
  }

  static async delete(id) {
    return await db('histories').where({ id }).del();
  }
}

module.exports = History; 