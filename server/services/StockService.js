const yahooFinance = require("yahoo-finance2").default;
const axios = require("axios");

class StockService {
  static async getStockData(symbol, range = "1w") {
    const days = this.getDaysFromRange(range);
    const now = new Date();
    const from = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    const chart = await yahooFinance.chart(symbol, {
      period1: from,
      period2: now,
      interval: "1d",
    });

    const quotes = chart.quotes;
    if (!quotes) {
      throw new Error("株価データが取得できませんでした。");
    }

    return this.formatStockData(quotes);
  }

  static async getCompanyInfo(symbol) {
    const info = await yahooFinance.quote(symbol);
    return {
      name: info.longName || null,
      exchange: info.fullExchangeName || null,
      currency: info.currency || null,
    };
  }

  static async predictStockPrice(lastPrice, model = "model1") {
    if (model === "model1") {
      return this.simplePrediction(lastPrice);
    } else {
      return await this.mlPrediction(lastPrice, model);
    }
  }

  static getDaysFromRange(range) {
    switch (range) {
      case "1m":
        return 30;
      case "1y":
        return 365;
      case "3y":
        return 365 * 3;
      default:
        return 7; // '1w'
    }
  }

  static formatStockData(quotes) {
    const result = quotes.map((quote) => ({
      date: quote.date,
      close: quote.close ?? null,
    }));

    const actual = result.map((d) => d.close ?? null);
    const actualDates = result.map((d) => d.date.toISOString().slice(0, 10));

    if (actual.length === 0) {
      throw new Error("株価データが見つかりませんでした");
    }

    return { actual, actualDates, result };
  }

  static simplePrediction(lastPrice) {
    return Array.from({ length: 7 }, (_, i) =>
      Math.round(lastPrice * Math.pow(1.01, i + 1))
    );
  }

  static async mlPrediction(lastPrice, model) {
    const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000";
    
    const mlRes = await axios.post(`${ML_API_URL}/predict`, {
      prev_close: lastPrice,
      return: 0.01,
      model: model,
    });
    
    return mlRes.data.predicted;
  }

  static generatePredictedDates() {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i + 1);
      return date.toISOString().slice(0, 10);
    });
  }
}

module.exports = StockService; 