<template>
  <div>
    <button v-text="connectionButtonTitle" @click="handleClickConnectionButton" />
    <div v-text="walletAddress" />
  </div>
</template>

<script lang="ts" setup>
import { LikeCoinEVMWalletConnector } from "@likecoin/evm-wallet-connector";

const walletAddress = ref<string>("");
const connector = ref<LikeCoinEVMWalletConnector | null>(null);

const connectionButtonTitle = computed(() =>
  walletAddress.value ? "Disconnect" : "Connect"
);

onMounted(() => {
  const { magicLinkAPIKey, rpcURL, chainId } = useRuntimeConfig().public;
  connector.value = new LikeCoinEVMWalletConnector({
    magicLinkAPIKey,
    rpcURL,
    chainId: Number(chainId),
    onSelectConnectProvider: (providerId: string) => {
      console.log("Selected", providerId);
    },
    onConnect: (connection: { walletAddress: string, providerId: string }) => {
      walletAddress.value = connection.walletAddress;
    },
    onDisconnect: () => {
      walletAddress.value = "";
    },
  });
})

function handleClickConnectionButton() {
  if (walletAddress.value) {
    connector.value?.disconnect();
  } else {
    connector.value?.showConnectPortal();
  }
}
</script>
