export interface GeminiRes {
  symbol: string;
  open: string;
  high: string;
  low: string;
  close: string;
  changes: string[];
  bid: string;
  ask: string;
}

// const btcusdData: GeminiRes = {
//   symbol: "BTCUSD",
//   open: "70951.55",
//   high: "71800",
//   low: "70723.25",
//   close: "71114.6",
//   changes: ["71128.16", "70951.55", "71299.79", "71470.77", "71117.3"],
//   bid: "71113.96",
//   ask: "71137.44",
// };

export interface OKXRes {
  code: string;
  msg: string;
  data: SwapData[];
}
interface SwapData {
  instType: string;
  instId: string;
  last: string;
  lastSz: string;
  askPx: string;
  askSz: string;
  bidPx: string;
  bidSz: string;
  open24h: string;
  high24h: string;
  low24h: string;
  volCcy24h: string;
  vol24h: string;
  ts: string;
  sodUtc0: string;
  sodUtc8: string;
}

// const OKXRes: OKXRes = {
//   code: "0",
//   msg: "",
//   data: [
//     {
//       instType: "SWAP",
//       instId: "BTC-USD-SWAP",
//       last: "70537.6",
//       lastSz: "116",
//       askPx: "70537.6",
//       askSz: "3581",
//       bidPx: "70537.5",
//       bidSz: "1031",
//       open24h: "71221.4",
//       high24h: "71654.7",
//       low24h: "70050.4",
//       volCcy24h: "11612.4897",
//       vol24h: "8238702",
//       ts: "1717705057508",
//       sodUtc0: "71128.9",
//       sodUtc8: "71299.8",
//     },
//   ],
// };

interface SymbolData {
  time: number;
  symbol: string;
  buy: string;
  sell: string;
  changeRate: string;
  changePrice: string;
  high: string;
  low: string;
  vol: string;
  volValue: string;
  last: string;
  averagePrice: string;
  takerFeeRate: string;
  makerFeeRate: string;
  takerCoefficient: string;
  makerCoefficient: string;
}

export interface KucoinRes {
  code: string;
  data: SymbolData;
}

// const responseData: KucoinRes = {
//   code: "200000",
//   data: {
//     time: 1717704848008,
//     symbol: "BTC-USDT",
//     buy: "70427.5",
//     sell: "70427.6",
//     changeRate: "-0.0112",
//     changePrice: "-804.3",
//     high: "71650",
//     low: "70115.2",
//     vol: "1503.88943346",
//     volValue: "106845274.285593911",
//     last: "70428.9",
//     averagePrice: "71196.06883708",
//     takerFeeRate: "0.001",
//     makerFeeRate: "0.001",
//     takerCoefficient: "1",
//     makerCoefficient: "1"
//   }
// };
