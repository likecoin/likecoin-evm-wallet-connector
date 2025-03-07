<template>
  <v-row>
    <v-col class="d-flex flex-column justify-center align-center">
      <v-btn color="primary" @click="handleClickConnectionButton">{{ connectButtonTitle }}</v-btn>
      <div v-text="walletAddress" />
    </v-col>
  </v-row>
</template>

<script>
import { LikeCoinEVMWalletConnector } from "@likecoin/evm-wallet-connector";

export default {
  name: "IndexPage",
  data() {
    return {
      walletAddress: "",
    };
  },
  computed: {
    isConnected() {
      return !!this.walletAddress;
    },
    connectButtonTitle() {
      return this.isConnected ? "Disconnect" : "Connect";
    },
  },
  mounted() {
    this.connector = new LikeCoinEVMWalletConnector({
      magicLinkAPIKey: this.$config.magicLinkAPIKey,
      rpcURL: this.$config.rpcURL,
      chainId: this.$config.chainId,
      onSelectConnectProvider: (providerId) => {
        console.log("Selected", providerId);
      },
      onConnect: (connection) => {
        this.walletAddress = connection.walletAddress;
      },
      onDisconnect: () => {
        this.walletAddress = "";
      },
    });
  },
  methods: {
    handleClickConnectionButton() {
      if (this.walletAddress) {
        this.connector.disconnect();
      } else {
        this.connector.showConnectPortal();
      }
    },
  },
};
</script>
