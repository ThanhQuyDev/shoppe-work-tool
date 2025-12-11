const catchAsync = require('../utils/catchAsync');
const { tradingViewService } = require('../services');

const getKlines = catchAsync(async (req, res) => {
  const { symbol = 'BTCUSDT', interval = '1h', limit = 200 } = req.query;
  const data = await tradingViewService.getKlines(symbol, interval, Number(limit));
  res.send(data);
});

module.exports = {
  getKlines,
};
