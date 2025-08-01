const db = require('../db');
const crypto = require('crypto');

class User {
  static async create({ username, email, password }) {
    const salt = crypto.randomBytes(6).toString('hex');
    const hashedPassword = this.hashPassword(password, salt);

    return await db('users').insert({
      username,
      email,
      password: hashedPassword,
      salt: salt,
    });
  }

  static async findByUsername(username) {
    return await db('users').where({ username }).first();
  }

  static async findById(id) {
    return await db('users').where({ id }).first();
  }

  static hashPassword(password, salt) {
    return crypto
      .createHash('sha256')
      .update(salt + password)
      .digest('hex');
  }

  static verifyPassword(password, salt, hashedPassword) {
    const inputHash = this.hashPassword(password, salt);
    return inputHash === hashedPassword;
  }
}

module.exports = User; 