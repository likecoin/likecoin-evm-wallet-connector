<template>
  <div class="min-h-full">
    <nav as="nav" class="bg-gray-800">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between space-x-10">
          <div class="flex items-center space-x-4">
            <img
              class="shrink-0 size-8"
              src="./assets/logo.svg"
              alt="LikeCoin"
            />
            <h1 class="text-white">LikeCoin EVM Wallet Connector Demo</h1>
          </div>

          <div>
            <button
              type="button"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              v-text="connectionButtonTitle"
              @click="handleClickConnectionButton"
            />
          </div>
        </div>

        <div class="flex items-baseline space-x-4 mt-4">
          <button
            v-for="item in menuItems"
            :key="item.id"
            :class="[
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
              'rounded-md px-3 py-2 text-sm font-medium',
            ]"
            v-text="item.name"
            @click="currentMenuItemId = item.id"
          />
        </div>
      </div>
    </nav>

    <header class="bg-white shadow-sm">
      <div
        class="flex justify-between items-center max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 gap-4"
      >
        <h1
          class="text-3xl font-bold tracking-tight text-gray-900"
          v-text="title"
        />
      </div>
    </header>

    <main>
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div v-if="walletAddress">
          <div class="text-center text-gray-500 mt-4">
            <span class="text-sm">Connected wallet address through {{ currentProviderId }}</span><br />
            <code v-text="walletAddress" />
          </div>
        </div>

        <div v-if="!walletAddress" class="mt-10 text-center text-gray-500">
          Please connect to proceed
        </div>

        <form
          v-else-if="
            currentMenuItemId === 'personal_sign' ||
            currentMenuItemId === 'sign_transaction'
          "
          @submit="handleSubmit"
        >
          <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
              <div
                class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"
              >
                <div class="col-span-full">
                  <label class="block text-sm/6 font-medium text-gray-900"
                    >Message</label
                  >
                  <div class="mt-2">
                    <textarea
                      rows="3"
                      class="block w-full rounded-md bg-white px-3 py-1.5 text-base font-mono text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      v-model="message"
                    />
                  </div>
                </div>
              </div>
              <div class="mt-4 text-xs font-mono break-all" v-text="result" />
            </div>
          </div>

          <div class="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Submit
            </button>
          </div>
        </form>
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
const menuItems = computed(() =>
  MENU_ITEMS.map((item) => ({
    ...item,
    current: item.id === currentMenuItemId.value,
  }))
);

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
