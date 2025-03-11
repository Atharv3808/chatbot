const WebSocket = require('ws');
require('dotenv').config();

const TWELVE_DATA_API_KEY = 'b46c722b36e0400f9fd4b80df02b7bb6';
const wsUrl = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${TWELVE_DATA_API_KEY}`;

module.exports = {
    subscribeToStock: (symbol, callback) => {
        const ws = new WebSocket(wsUrl);

        ws.on('open', () => {
            console.log(`Connected to Twelve Data WebSocket for ${symbol}`);
            ws.send(JSON.stringify({ action: "subscribe", symbols: symbol }));
        });

        ws.on('message', (data) => {
            try {
                const parsedData = JSON.parse(data);
                if (parsedData[symbol] && parsedData[symbol].price) {
                    callback({
                        symbol: symbol,
                        price: parsedData[symbol].price,
                        timestamp: new Date().toISOString()
                    });
                }
            } catch (err) {
                console.error('Error parsing WebSocket message:', err);
            }
        });

        ws.on('error', (error) => {
            console.error('WebSocket Error:', error);
        });

        ws.on('close', () => {
            console.log(`Disconnected from Twelve Data WebSocket for ${symbol}`);
        });
    }
};