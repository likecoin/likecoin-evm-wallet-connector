<template>
  <div class="lk-min-h-full">
    <nav as="nav" class="lk-bg-gray-800">
      <div class="lk-mx-auto lk-max-w-7xl lk-px-4 lk-sm:px-6 lg:lk-px-8 lk-py-4">
        <div class="lk-flex lk-items-center lk-justify-between lk-space-x-10">
          <div class="lk-flex lk-items-center lk-space-x-4">
            <img
              class="lk-shrink-0 lk-size-8"
              src="./assets/logo.svg"
              alt="LikeCoin"
            />
            <h1 class="lk-text-white">LikeCoin EVM Wallet Connector Demo</h1>
          </div>

          <div>
            <button
              type="button"
              class="lk-rounded-md lk-bg-indigo-600 lk-px-3 lk-py-2 lk-text-sm lk-font-semibold lk-text-white lk-shadow-xs hover:lk-bg-indigo-500 lk-focus-visible:outline-2 focus-visible:lk-outline-offset-2 focus-visible:lk-outline-indigo-600"
              v-text="connectionButtonTitle"
              @click="handleClickConnectionButton"
            />
          </div>
        </div>

        <div class="lk-flex lk-items-baseline lk-space-x-4 lk-mt-4">
          <button
            v-for="item in menuItems"
            :key="item.id"
            :class="[
              item.current
                ? 'lk-bg-gray-900 lk-text-white'
                : 'lk-text-gray-300 hover:lk-bg-gray-700 hover:lk-text-white',
              'lk-rounded-md lk-px-3 lk-py-2 lk-text-sm lk-font-medium',
            ]"
            v-text="item.name"
            @click="currentMenuItemId = item.id"
          />
        </div>
      </div>
    </nav>

    <header class="lk-bg-white lk-shadow-sm">
      <div
        class="lk-flex lk-justify-between lk-items-center lk-max-w-7xl lk-mx-auto lk-px-4 lk-py-6 sm:lk-px-6 lg:lk-px-8 lk-gap-4"
      >
        <h1
          class="lk-text-3xl lk-font-bold lk-tracking-tight lk-text-gray-900"
          v-text="title"
        />
      </div>
    </header>

    <main>
      <div class="lk-mx-auto lk-max-w-7xl lk-px-4 lk-py-6 sm:lk-px-6 lg:lk-px-8">
        <div v-if="walletAddress">
          <div class="lk-text-center lk-text-gray-500 lk-mt-4">
            <span class="lk-text-sm">Connected wallet address through {{ currentProviderId }}</span><br />
            <code v-text="walletAddress" />
          </div>
        </div>

        <div v-if="!walletAddress" class="lk-mt-10 lk-text-center lk-text-gray-500">
          Please connect to proceed
        </div>

        <form
          v-else-if="
            currentMenuItemId === 'personal_sign' ||
            currentMenuItemId === 'sign_transaction'
          "
          @submit="handleSubmit"
        >
          <div class="lk-space-y-12">
            <div class="lk-border-b lk-border-gray-900/10 lk-pb-12">
              <div
                class="lk-mt-10 lk-grid lk-grid-cols-1 lk-gap-x-6 lk-gap-y-8 sm:lk-grid-cols-6"
              >
                <div class="lk-col-span-full">
                  <label class="lk-block lk-text-sm/6 lk-font-medium lk-text-gray-900"
                    >Message</label
                  >
                  <div class="lk-mt-2">
                    <textarea
                      rows="3"
                      class="lk-block lk-w-full lk-rounded-md lk-bg-white lk-px-3 lk-py-1.5 lk-text-base lk-font-mono lk-text-gray-900 lk-outline-1 -lk-outline-offset-1 lk-outline-gray-300 placeholder:lk-text-gray-400 focus:lk-outline-2 focus:-lk-outline-offset-2 focus:lk-outline-indigo-600 sm:lk-text-sm/6"
                      v-model="message"
                    />
                  </div>
                </div>
              </div>
              <div class="lk-mt-4 lk-text-xs lk-font-mono lk-break-all" v-text="result" />
            </div>
          </div>

          <div class="lk-mt-6 lk-flex lk-items-center lk-justify-end lk-gap-x-6">
            <button
              type="submit"
              class="lk-rounded-md lk-bg-indigo-600 lk-px-3 lk-py-2 lk-text-sm lk-font-semibold lk-text-white lk-shadow-xs hover:lk-bg-indigo-500 focus-visible:lk-outline-2 focus-visible:lk-outline-offset-2 focus-visible:lk-outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>

        <div v-else-if="currentMenuItemId === 'magic'" class="lk-flex lk-flex-col lk-items-center lk-py-6 lk-gap-4 lk-max-w-md lk-mx-auto">
          <button
            v-for="item in magicLinkActions"
            type="button"
            class="lk-w-full lk-rounded-md lk-bg-gray-600 lk-px-3 lk-py-2 lk-text-sm lk-font-mono lk-text-white lk-shadow-xs hover:lk-bg-gray-500 lk-focus-visible:outline-2 focus-visible:lk-outline-offset-2 focus-visible:lk-outline-gray-600"
            :key="item.id"
            v-text="item.name"
            @click="item.onClick"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from "vue";

import { LikeCoinEVMWalletConnector } from "../lib";

const MENU_ITEMS = [
  { id: "personal_sign", name: "Personal Sign" },
  { id: "sign_transaction", name: "Sign Transaction" },
];

const MAGIC_WALLET_FUNCTIONS = [
  "showUI",
  "showAddress",
  "showBalances",
  "showNFTs",
  "showSendTokensUI",
  "showOnRamp",
] as const;

const currentMenuItemId = ref(MENU_ITEMS[0].id);
const walletAddress = ref<string | undefined>(undefined);
const message = ref<string>("");
const result = ref<string>("");
const currentProviderId = ref<string | undefined>(undefined);
const connector = ref<LikeCoinEVMWalletConnector | null>(null);

const title = computed(
  () =>
    menuItems.value.find((item) => item.id === currentMenuItemId.value)?.name
);
const connectionButtonTitle = computed(() =>
  walletAddress.value ? "Disconnect" : "Connect"
);
const menuItems = computed(() => {
  const items = [...MENU_ITEMS];
  if (currentProviderId.value === "email") {
    items.push({
      id: "magic",
      name: "Magic Link UI",
    });
  }
  return items.map((item) => ({
    ...item,
    current: item.id === currentMenuItemId.value,
  }))
});

const magicLinkActions = computed(() => {
  const magic = connector.value?.magic
  if (!magic) return [];

  return MAGIC_WALLET_FUNCTIONS.map((functionName) => ({
    id: functionName,
    name: `magic.wallet.${functionName}()`,
    onClick: () => {
      if (typeof magic.wallet[functionName] === "function") {
        magic.wallet[functionName]();
      }
    },
  }))
})

watch(
  () => currentMenuItemId.value,
  () => {
    message.value = "";
    result.value = "";
  }
);

onMounted(() => {
  connector.value = new LikeCoinEVMWalletConnector({
    magicLinkAPIKey: import.meta.env.VITE_MAGIC_LINK_API_KEY as string,
    rpcURL: import.meta.env.VITE_RPC_URL as string,
    chainId: Number(import.meta.env.VITE_CHAIN_ID),
    onSelectConnectProvider: (providerId: string) => {
      console.log("Selected provider:", providerId);
    },
    onConnect: (connection: { walletAddress: string, providerId: string }) => {
      walletAddress.value = connection.walletAddress;
      currentProviderId.value = connection.providerId;
    },
    onDisconnect: () => {
      walletAddress.value = undefined;
      currentProviderId.value = undefined;
      message.value = "";
      result.value = "";
    },
    onSignMessage: (signature: string) => {
      result.value = signature;
    },
    onSignTransaction(hash: string) {
      result.value = hash;
    },
  });
});

function handleClickConnectionButton() {
  if (walletAddress.value) {
    connector.value?.disconnect();
  } else {
    connector.value?.showConnectPortal();
  }
}

function handleSubmit(event: Event) {
  event.preventDefault();

  switch (currentMenuItemId.value) {
    case "personal_sign":
      connector.value?.signMessage(message.value);
      break;

    case "sign_transaction":
      try {
        const payload = JSON.parse(message.value);
        connector.value?.signTransaction(payload);
      } catch (error) {
        console.error(error);
      }
      break;
    default:
      break;
  }
}
</script>
