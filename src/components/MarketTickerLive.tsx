import { useEffect } from 'react';

declare global {
  interface Window {
    TradingView: any;
  }
}

const MarketTickerLive = () => {
  return (
    <div className="relative bg-background border-b">
      <div className="max-w-[1920px] mx-auto">
        <div className="w-full h-[46px] overflow-hidden">
          <iframe
            src="https://s.tradingview.com/embed-widget/ticker-tape/?locale=en#%7B%22symbols%22%3A%5B%7B%22proName%22%3A%22NSE%3ANIFTY%22%2C%22title%22%3A%22Nifty%2050%22%7D%2C%7B%22proName%22%3A%22BSE%3ASENSEX%22%2C%22title%22%3A%22Sensex%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ASPXUSD%22%2C%22title%22%3A%22S%26P%20500%22%7D%2C%7B%22proName%22%3A%22FOREXCOM%3ANSXUSD%22%2C%22title%22%3A%22Nasdaq%20100%22%7D%2C%7B%22proName%22%3A%22FX_IDC%3AUSDINR%22%2C%22title%22%3A%22USD%2FINR%22%7D%2C%7B%22proName%22%3A%22BITSTAMP%3ABTCUSD%22%2C%22title%22%3A%22BTC%2FUSD%22%7D%5D%2C%22showSymbolLogo%22%3Atrue%2C%22colorTheme%22%3A%22light%22%2C%22isTransparent%22%3Afalse%2C%22displayMode%22%3A%22adaptive%22%2C%22width%22%3A%22100%25%22%2C%22height%22%3A46%7D"
            style={{
              width: "100%",
              height: "46px",
              margin: 0,
              padding: 0,
              border: "none"
            }}
            title="Market Ticker"
          />
        </div>
      </div>
    </div>
  );
};

export default MarketTickerLive;
