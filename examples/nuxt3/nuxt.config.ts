// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ['@likecoin/evm-wallet-connector/style.css'],
  runtimeConfig: {
    public: {
      magicLinkAPIKey: process.env.MAGIC_LINK_API_KEY,
      rpcURL: process.env.RPC_URL,
      chainId: process.env.CHAIN_ID,
    },
  },
  devtools: { enabled: true }
})
