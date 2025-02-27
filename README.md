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
```js
import { LikeCoinEVMWalletConnector } from "@likecoin/evm-wallet-connector";

import "@likecoin/evm-wallet-connector/style.css";

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
