# LikeCoin EVM Wallet Connector

## Installation

```bash
npm i @likecoin/evm-wallet-connector
```

## Development
Run development server
```
$ npm run dev
```

## Usage

### Setup
#### JS
```js
import { LikeCoinEVMWalletConnector } from "@likecoin/evm-wallet-connector";

const connector = new LikeCoinEVMWalletConnector({
  magicLinkAPIKey: "API_KEY",
  rpcURL: "https://sepolia.optimism.io",
  chainId: 11155420,
  onSelectConnectProvider: (providerId: string) => {
    console.log("Selected provider:", providerId);
  },
  onConnect: ({ walletAddress }: string) => {
    console.log("Connected wallet address:", walletAddress);
  },
  onDisconnect: () => {
    console.log("Disconnected");
  },
  onSignMessage: (signature: string) => {
    console.log("Signed signature:", signature);
  },
  onSignTransaction(hash: string) {
    console.log("Transaction hash:", hash);
  },
});
```

#### CSS
Please include the `@likecoin/evm-wallet-connector/style.css` CSS file to your HTML file.

##### Nuxt
Please include the CSS file in the Nuxt config file.

```js
// Nuxt 2
// nuxt.config.js
export default {
  ...
  css: ['@likecoin/evm-wallet-connector/style.css'],
  ...
}
```
[Nuxt 2 Example](/examples/nuxt2/)


```js
// Nuxt 3
// nuxt.config.ts
export default defineNuxtConfig({
  ...
  css: ['@likecoin/evm-wallet-connector/style.css'],
  ...
})
```

[Nuxt 3 Example](/examples/nuxt3/)

### Connect
```js
// Show connect portal
connector.showConnectPortal();

// Connect with specific provider
connector.connect('email', { email: 'davidng@liker.land' });
```

### Personal sign
```js
connector.signMessage(message);
```

### Sign transaction
```js
connector.signTransaction(payloadObject);
```

### Disconnect
```js
connector.disconnect();
```
