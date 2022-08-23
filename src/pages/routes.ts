import { createRouter, RouterHistory } from "vue-router";
import HomePage from "./home/HomePage.vue";
import SignMessage from "./sign-message/SignMessage.vue";
import SendChainMessage from "./send-chain-message/SendChainMessage.vue";
import SendNFTMessage from "./send-nft-message/SendNFTMessage.vue";
import FlipperCalculator from "./flipper-calculator/FlipperCalculator.vue";

const basePageTitle = "TuckTools";

const routes = [
    {
        path: "/",
        component: HomePage,
        meta: {
            title: basePageTitle,
        },
    },

    {
        path: "/sign-message/",
        component: SignMessage,
        meta: {
            title: basePageTitle + " - " + "Sign Message",
        },
    },

    {
        path: "/send-chain-message/",
        component: SendChainMessage,
        meta: {
            title: basePageTitle + " - " + "On-chain messages",
        },
    },

    {
        path: "/send-nft-message/",
        component: SendNFTMessage,
        meta: {
            title: basePageTitle + " - " + "NFT message",
        },
    },

    {
        path: "/flipper-calculator/",
        component: FlipperCalculator,
        meta: {
            title: basePageTitle + " - " + "Flipper Calculator",
        },
    },
];

export default function (history: RouterHistory) {
    return createRouter({
        history,
        routes,
    });
}
