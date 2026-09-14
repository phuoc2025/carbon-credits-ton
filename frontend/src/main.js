"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const client_1 = __importDefault(require("react-dom/client"));
const ui_react_1 = require("@tonconnect/ui-react");
const App_tsx_1 = __importDefault(require("./App.tsx"));
require("./index.css");
// URL dẫn tới file tonconnect-manifest.json của bạn
const manifestUrl = 'https://hnsm-carbon-rewards.vercel.app/tonconnect-manifest.json';
client_1.default.createRoot(document.getElementById('root')).render(<react_1.default.StrictMode>
    <ui_react_1.TonConnectUIProvider manifestUrl={manifestUrl}>
      <App_tsx_1.default />
    </ui_react_1.TonConnectUIProvider>
  </react_1.default.StrictMode>);
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}
