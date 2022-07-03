import { createRouter, RouterHistory } from 'vue-router';
import Homepage from './home/Home.vue';
import SignMessage from './sign-message/SignMessage.vue';
import SendChainMessage from './send-chain-message/SendChainMessage.vue';
import SendNFTMessage from './send-nft-message/SendNFTMessage.vue';
import FlipperCalculator from './flipper-calculator/FlipperCalculator.vue';

const routes = [
    {
        path: '/',
        component: Homepage
    },

    {
        path: '/sign-message/',
        component: SignMessage
    },

    {
        path: '/send-chain-message/',
        component: SendChainMessage
    },

    {
        path: '/send-nft-message/',
        component: SendNFTMessage
    },

    {
        path: '/flipper-calculator/',
        component: FlipperCalculator
    },
];

export default function (history: RouterHistory) {
    return createRouter({
        history,
        routes
    });
}