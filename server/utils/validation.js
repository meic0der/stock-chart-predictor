class Validation {
  static isValidSymbol(symbol) {
    return symbol && typeof symbol === 'string' && symbol.trim().length > 0;
  }

  static isValidRange(range) {
    const validRanges = ['1w', '1m', '1y', '3y'];
    return validRanges.includes(range);
  }

  static isValidModel(model) {
    const validModels = ['model1', 'model2', 'model3'];
    return validModels.includes(model);
  }

  static isValidUsername(username) {
    return username && typeof username === 'string' && username.length >= 3;
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return email && emailRegex.test(email);
  }

  static isValidPassword(password) {
    return password && typeof password === 'string' && password.length >= 6;
  }

  static isValidNote(note) {
    return typeof note === 'string';
  }
}

module.exports = Validation; 