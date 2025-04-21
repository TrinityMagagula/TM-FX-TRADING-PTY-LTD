const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://mt-trading-signup-and-log-in-default-rtdb.firebaseio.com"
});

const db = admin.database();

let price = 1000;
const volatility = 0.75;
const drift = 0.02;

// Define timeframes in milliseconds
const timeframes = {
  '1m': 60000,
  '5m': 5 * 60000,
  '15m': 15 * 60000,
  '30m': 30 * 60000,
  '1h': 60 * 60000,
  '4h': 4 * 60 * 60000,
  '1d': 24 * 60 * 60000,
  '1w': 7 * 24 * 60 * 60000,
  '1mn': 30 * 24 * 60 * 60000,
};

// Setup tracking for each timeframe
const candleTrackers = {};
for (const tf in timeframes) {
  candleTrackers[tf] = {
    prices: [],
    start: Date.now(),
    open: price,
    high: price,
    low: price,
    lastTimestamp: null,
    ref: db.ref(`syntheticIndex/candles/${tf}`),
    currentRef: db.ref(`syntheticIndex/currentCandle/${tf}`)
  };
}

function updateCandles(price, timestamp) {
  for (const [tf, tracker] of Object.entries(candleTrackers)) {
    const elapsed = timestamp - tracker.start;

    // Update high/low
    tracker.high = Math.max(tracker.high, price);
    tracker.low = Math.min(tracker.low, price);

    // Update current candle in Firebase (for floating display)
    tracker.currentRef.set({
      open: tracker.open,
      high: tracker.high,
      low: tracker.low,
      close: price,
      timestamp: Math.floor(tracker.start / 1000)
    });

    // Store prices for use if needed
    tracker.prices.push(price);

    // Finalize and push candle if timeframe has passed
    if (elapsed >= timeframes[tf]) {
      const close = price;
      const finalizedCandle = {
        open: tracker.open,
        high: tracker.high,
        low: tracker.low,
        close,
        timestamp: Math.floor(tracker.start / 1000)
      };

      tracker.ref.push(finalizedCandle);

      // Reset for next candle
      tracker.prices = [];
      tracker.open = price;
      tracker.high = price;
      tracker.low = price;
      tracker.start = timestamp;
    }
  }
}

// Main loop
setInterval(() => {
  const randomShock = Math.random() * 2 - 1;
  const change = drift + volatility * randomShock;
  price += change;
  const priceRounded = parseFloat(price.toFixed(2));
  const timestamp = Date.now();

  console.log("Current Price:", priceRounded);

  // 1. Save current price (live feed)
  db.ref("syntheticIndex/price").set(priceRounded);

  // 2. Push price history (tick level)
  db.ref("syntheticIndex/priceHistory").push({ price: priceRounded, timestamp });

  // 3. Update candlestick data for all timeframes
  updateCandles(priceRounded, timestamp);

}, 100); // update every 100ms
