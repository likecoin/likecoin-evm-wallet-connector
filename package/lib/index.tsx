import * as React from "react";
import { createRoot, type Root } from "react-dom/client";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";

import { ConnectPortalDialog } from "./components/ConnectPortalDialog";

import "./style.css";
import { PlainDialog } from "./components/PlainDialog";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const ROOT_ELEMENT_ID = "likecoin-evm-wallet-connector";

export interface LikeCoinEVMWalletConnectionProvider {
  id: string;
  name: string;
  provider: any;
}

export interface LikeCoinEVMWalletConnectorUIProps {
  magicLinkAPIKey?: string;
  rpcURL?: string;
  chainId?: number;
  logoURL?: string;
  logoSize?: number;
  onSelectConnectProvider?: (providerId: string) => void;
  onConnect?: (payload: { walletAddress: string; providerId: string }) => void;
  onDisconnect?: () => void;
  onSignMessage?: (signature: string) => void;
  onSignTransaction?: (hash: string) => void;
}

export interface LikeCoinEVMWalletConnectorUIState {
  isConnecting: boolean;
  isConnectPortalDialogOpen: boolean;
  providerMap: Record<string, LikeCoinEVMWalletConnectionProvider>;
  provider?: any;
  providerId?: string;
  preferredProviderId?: string;
  magic?: Magic;
}

export class LikeCoinEVMWalletConnectorUI extends React.Component<
  LikeCoinEVMWalletConnectorUIProps,
  LikeCoinEVMWalletConnectorUIState
> {
  state: LikeCoinEVMWalletConnectorUIState = {
    isConnecting: false,
    isConnectPortalDialogOpen: false,
    providerMap: {},
    preferredProviderId: "",
  };

  componentDidMount(): void {
    this._getAvailableConnectionMethods();
  }

  componentWillUnmount(): void {
    window.removeEventListener(
      "eip6963:announceProvider",
      this._handleEIP6963Announce as EventListener
    );
  }

  private _getAvailableConnectionMethods() {
    if (typeof window.ethereum === "undefined") {
      console.error("No EIP-1193 wallet detected");
      return;
    }

    window.addEventListener(
      "eip6963:announceProvider",
      this._handleEIP6963Announce as EventListener
    );
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  }

  private _handleEIP6963Announce = (
    event: CustomEvent<{ info: { name: string; rdns: string }; provider: any }>
  ) => {
    const { info, provider } = event.detail;
    this.setState((prevState) => ({
      providerMap: {
        ...prevState.providerMap,
        [info.rdns]: {
          id: info.rdns,
          name: info.name,
          provider,
        },
      },
    }));
  };

  private get _providersToConnect() {
    const providers = [
      { id: "email", name: "Continue With Email" },
      ...Object.keys(this.state.providerMap).map((key) => ({
        id: key,
        name: this.state.providerMap[key].name,
      })),
    ];
    providers.sort((a, b) => {
      if (a.id === this.state.preferredProviderId) return -1;
      if (b.id === this.state.preferredProviderId) return 1;
      if (a.id === "email") return -1;
      if (b.id === "email") return 1;
      return 0;
    });
    return providers;
  }

  public toggleConnectionPortalDialog = (
    value?: boolean | null,
    { providerId = "" } = {}
  ) => {
    this.setState({
      isConnectPortalDialogOpen:
        typeof value === "boolean"
          ? value
          : !this.state.isConnectPortalDialogOpen,
      preferredProviderId: providerId,
    });
  };

  public connect = async (providerId: string, payload?: { email: string }) => {
    this.props.onSelectConnectProvider?.(providerId);
    this.setState({ isConnecting: true });
    this.toggleConnectionPortalDialog(false);

    try {
      let walletAddress = "";
      if (providerId === "email") {
        if (!payload?.email) {
          throw new Error("Missing Email");
        }

        if (!this.props.magicLinkAPIKey) {
          throw new Error("Missing Magic Link API Key");
        }

        if (!this.props.rpcURL) {
          throw new Error("Missing RPC URL For Magic Link");
        }

        const magic = new Magic(this.props.magicLinkAPIKey, {
          network: {
            rpcUrl: this.props.rpcURL,
            chainId: this.props.chainId,
          },
        });

        await magic.auth.loginWithEmailOTP({
          email: payload.email,
          showUI: true,
        });
        const userInfo = await magic.user.getInfo();
        if (!userInfo.publicAddress) {
          throw new Error("Magic Link user public address not found");
        }
        walletAddress = userInfo.publicAddress;
        const magicProvider = new ethers.BrowserProvider(magic.rpcProvider);
        this.setState({ magic, provider: magicProvider });
      } else {
        const { provider } = this.state.providerMap[providerId];
        if (!provider) {
          throw new Error("Provider not found");
        }
        this.setState({ provider });
        [walletAddress] = await provider.request({
          method: "eth_requestAccounts",
        });
      }
      this.setState({ providerId });
      this.props.onConnect?.({ walletAddress, providerId });
    } catch (error) {
      this.toggleConnectionPortalDialog(true);
      console.error(`Failed to connect with [${providerId}]`, error);
    } finally {
      this.setState({ providerId, isConnecting: false });
    }
  };

  private connectPortalDialogClose = () => {
    if (this.state.isConnecting) {
      return;
    }
    this.setState({ isConnectPortalDialogOpen: false });
  };

  public disconnect = () => {
    if (this.state.magic) {
      this.state.magic.user.logout();
      this.setState({ magic: undefined });
    }
    this._handleDisconnect();
  };

  private _handleDisconnect = () => {
    this.setState({ provider: undefined });
    this.props.onDisconnect?.();
  };

  public get provider() {
    return this.state.provider;
  }

  public get providerId() {
    return this.state.providerId;
  }

  public get magic() {
    return this.state.magic;
  }

  public getSigner = async () => {
    if (this.state.magic) {
      return this.state.provider.getSigner();
    }
    const provider = new ethers.BrowserProvider(this.state.provider);
    return await provider?.getSigner();
  };

  public signMessage = async (message: string) => {
    const signer = await this.getSigner();
    const signature = await signer.signMessage(message);
    this.props.onSignMessage?.(signature);
    return signature;
  };

  public signTransaction = async (transaction: any) => {
    const signer = await this.getSigner();
    const signature = await signer.sendTransaction(transaction);
    this.props.onSignTransaction?.(signature.hash);
    return signature;
  };

  public getWalletAddress = async () => {
    const signer = await this.getSigner();
    const address = await signer.getAddress();
    return address;
  };

  render() {
    return (
      <>
        <PlainDialog isOpen={this.state.isConnecting}>
          <div className="lk-text-center lk-py-10">
            <p>Connecting...</p>
          </div>
        </PlainDialog>
        <ConnectPortalDialog
          providers={this._providersToConnect}
          isOpen={this.state.isConnectPortalDialogOpen}
          logoURL={this.props.logoURL}
          logoSize={this.props.logoSize}
          onConnect={this.connect}
          onClose={this.connectPortalDialogClose}
        />
      </>
    );
  }
}

export interface LikeCoinEVMWalletConnectorOptions {
  magicLinkAPIKey?: string;
  rpcURL?: string;
  chainId?: number;
  logoURL?: string;
  logoSize?: number;
  onSelectConnectProvider?: (providerId: string) => void;
  onConnect?: (payload: { walletAddress: string; providerId: string }) => void;
  onDisconnect?: () => void;
  onSignMessage?: (signature: string) => void;
  onSignTransaction?: (hash: string) => void;
}

export class LikeCoinEVMWalletConnector {
  private _renderingRoot?: Root;
  private _uiRef?: React.RefObject<LikeCoinEVMWalletConnectorUI | null>;

  constructor(options: LikeCoinEVMWalletConnectorOptions = {}) {
    if (!document) {
      throw new Error(
        "LikeCoinEVMWalletConnector requires a browser environment to run."
      );
    }

    let rootEl = document.getElementById(ROOT_ELEMENT_ID);
    if (rootEl) {
      rootEl.remove();
    }
    rootEl = document.createElement("div");
    rootEl.setAttribute("id", ROOT_ELEMENT_ID);
    document.body.appendChild(rootEl);
    this._renderingRoot = createRoot(rootEl);
    this._uiRef = React.createRef<LikeCoinEVMWalletConnectorUI>();

    this._renderingRoot.render(
      <React.StrictMode>
        <LikeCoinEVMWalletConnectorUI
          ref={this._uiRef}
          magicLinkAPIKey={options.magicLinkAPIKey}
          rpcURL={options.rpcURL}
          chainId={options.chainId}
          logoURL={options.logoURL}
          logoSize={options.logoSize}
          onConnect={options.onConnect}
          onSelectConnectProvider={options.onSelectConnectProvider}
          onDisconnect={options.onDisconnect}
          onSignMessage={options.onSignMessage}
          onSignTransaction={options.onSignTransaction}
        />
      </React.StrictMode>
    );
  }

  private get ui() {
    return this._uiRef?.current;
  }

  public get provider() {
    return this.ui?.provider;
  }

  public get providerId() {
    return this.ui?.providerId;
  }

  public get magic() {
    return this.ui?.magic;
  }

  public showConnectPortal = ({ providerId = "" } = {}) => {
    this.ui?.toggleConnectionPortalDialog(null, { providerId });
  };

  public connect = (providerId: string, payload?: { email: string }) => {
    this.ui?.connect(providerId, payload);
  };

  public disconnect = () => {
    this.ui?.disconnect();
  };

  public getSigner = async () => {
    return await this.ui?.getSigner();
  };

  public signMessage = async (message: string) => {
    return await this.ui?.signMessage(message);
  };

  public signTransaction = async (transaction: any) => {
    return await this.ui?.signTransaction(transaction);
  };

  public getWalletAddress = async () => {
    return await this.ui?.getWalletAddress();
  };
}
