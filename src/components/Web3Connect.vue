<script setup lang="ts">
    import { useWalletStore } from "../lib/wallet-store";
    import { networkIsValid } from "../constants";

    const wallet = useWalletStore();

    let connectDisconnectSwitch = async () => {
        if (wallet.state.isConnected && !networkIsValid(wallet.state.providerChainID)) {
            await wallet.checkWrongNetwork();
        } else if (wallet.state.isConnected) {
            wallet.disconnect();
        } else {
            await wallet.connect();
        }
    };
</script>

<template>
    <p v-if="wallet.state.isConnected">
        Connected on {{ wallet.state.providerChainName }} as {{ wallet.state.address.substring(0, 6) + "..." }}
        <a
            v-if="!networkIsValid(wallet.state.providerChainID)"
            class="btn btn-link"
            @click.stop="connectDisconnectSwitch"
        >
            (Switch network)
        </a>
        <a
            v-if="networkIsValid(wallet.state.providerChainID)"
            class="btn btn-link"
            @click.stop="connectDisconnectSwitch"
        >
            (Disconnect)
        </a>
    </p>
    <button v-if="!wallet.state.isConnected" class="btn btn-primary" @click.stop="connectDisconnectSwitch">
        Connect
    </button>
</template>

<style scoped>
    p {
        color: white;
        margin-bottom: 0;
        mix-blend-mode: difference;
    }

    p > a {
        color: var(--brand-yellow);
        vertical-align: baseline;
    }
</style>
