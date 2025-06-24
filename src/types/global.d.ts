interface TradingViewWidget {
  widget: new (configuration: any) => any;
}

declare global {
  interface Window {
    TradingView: TradingViewWidget;
  }
}

export {}; 