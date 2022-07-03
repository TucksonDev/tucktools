<script setup lang="ts">
    import TopNavbar from '../../components/TopNavbar.vue';
    import Footer from '../../components/Footer.vue';
    import { AppMessages } from '../../messages/messages';
    import { ethers } from "ethers";
    import axios from 'axios';
    import { useWalletStore } from '../../lib/wallet-store';
    import { DEFAULT_NETWORK } from '../../constants';

    const wallet = useWalletStore();

    const sendMessage = async (message: string, recipient: string): Promise<string> => {
        if (
            !wallet.walletIsReady() ||
            !wallet.state.provider
        ) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            console.log(AppMessages.WalletNotConnectedErrorMessage);
            return '';
        }

        try {
            const messageToSend = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
            const transactionRequest = {
                'to': recipient,
                'data': messageToSend
            };
            const signer = await wallet.state.provider.getSigner();
            const transactionResponse = await signer.sendTransaction(transactionRequest);

            transactionResponse.wait().then((transactionReceipt) => {
                showTransactionConfirmation(transactionReceipt.transactionHash);
            });

            return transactionResponse.hash;
        } catch (error) {
            alert(AppMessages.BlockchainConnectionErrorMessage);
            throw error;
        }
    }

    let sendChainMessage = async () => {
        if (
            !wallet.walletIsReady() ||
            !wallet.state.provider
        ) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            console.log(AppMessages.WalletNotConnectedErrorMessage);
            return '';
        }

        let textToSend = (<HTMLInputElement>document.getElementById('message-to-send'))?.value;
        let recipientAddress = (<HTMLInputElement>document.getElementById('recipient-address'))?.value;
        if (!textToSend || !recipientAddress) {
            alert(AppMessages.AllFieldsRequiredErrorMessage);
            return;
        }

        if (!ethers.utils.isAddress(recipientAddress)) {
            alert(AppMessages.EthAddressIsNotValidFormat);
            return;
        }

        let resultBox = document.getElementById('sending-result');
        let transactionHash = await sendMessage(textToSend, recipientAddress);

        if (resultBox && transactionHash) {
            const linkUrl = wallet.state.blockExplorerBaseUrl + "/tx/" + transactionHash;
            resultBox.innerHTML =
                "The transaction has been sent to the blockchain, you can see its status " +
                "<a href='" + linkUrl + "' target='_blank'>by clicking here</a>.";
        }
    }

    let showTransactionConfirmation = (transactionHash: string) => {
        let resultBox = document.getElementById('sending-result');
        if (resultBox) {
            const linkUrl = wallet.state.blockExplorerBaseUrl + "/tx/" + transactionHash;
            resultBox.innerHTML =
                "Message sent! The transaction has been confirmed. You can see its status " +
                "<a href='" + linkUrl + "' target='_blank'>by clicking here</a>.";
        }
    }

    let readChainMessage = async () => {
        let transactionHash = (<HTMLInputElement>document.getElementById('transaction-hash'))?.value;
        if (!transactionHash) {
            alert(AppMessages.AllFieldsRequiredErrorMessage);
            return;
        }

        if (!ethers.utils.isHexString(transactionHash, 32) || !ethers.utils.isBytesLike(transactionHash)) {
            alert("Transaction ID message does not have the right format or length");
            return;
        }
        
        const transaction = await getBlockchainTransaction(transactionHash);
        if (!transaction.data) {
            alert("Transaction does not have a data field");
            return;
        }

        try {
            const decodedMessage = ethers.utils.toUtf8String(transaction.data);
            if (!decodedMessage) {
                alert("Transaction does not have a message in the data field");
                return;
            }

            let resultBox = document.getElementById('read-result');
            if (resultBox) {
                resultBox.innerHTML = decodedMessage;
            }
        } catch (error) {
            alert("Transaction does not have a message in the data field");
            return;
        }
    }

    let getBlockchainTransaction = async (transactionHash: string) => {
        try {
            const chainId = wallet.state.isConnected? wallet.state.providerChainID : DEFAULT_NETWORK;

            const getTransactionUrl =
                import.meta.env.VITE_BACKEND_ROOT + '/' +
                'eth/transaction/' +
                chainId + '/' +
                transactionHash;

            const axiosResponse = await axios.get(getTransactionUrl);

            return axiosResponse.data;
        } catch (error) {
            alert(AppMessages.SendBackendRequestErrorMessage);
            throw error;
        }
    }
</script>

<template>
    <TopNavbar />

    <div class="container main-container">
        <div class="row">
            <div class="col">
                <div class="section-title mb-4">
                    <h1>Send on-chain message</h1>
                </div>
                <div class="section-intro">
                    <p>
                        Write the message you want to send and to whom you want to send it.
                        Clicking "Send" will trigger Metamask to send a blockchain transaction.
                        Keep in mind that you will need to pay gas fees in order to send the transaction.
                        The recipient will receive the transaction with the message encoded in the "data" field.
                    </p>
                </div>
                <form @submit.prevent="sendChainMessage">
                    <div class="mb-4">
                        <label for="recipient-address">Recipient address</label>
                        <input type="text" class="form-control" id="recipient-address" />
                    </div>
                    <div class="mb-4">
                        <label for="message-to-send">Message to send</label>
                        <input type="text" class="form-control" id="message-to-send" />
                    </div>
                    <button type="submit" class="btn btn-primary">Send message</button>
                </form>
                <div class="mt-4">
                    <span>Result</span>
                    <p id="sending-result" class="border rounded p-2"></p>
                </div>
            </div>
            <div class="col offset-md-1 complementary-section">
                <div class="section-title mb-4">
                    <h1>Read on-chain message</h1>
                </div>
                <div class="section-intro">
                    <p>
                        Here you can specify a transaction ID and the system will try to decode
                        a message stored in the "data" field of the transaction.
                    </p>
                </div>
                <form @submit.prevent="readChainMessage">
                    <div class="mb-4">
                        <label for="transaction-hash">Transaction Hash</label>
                        <input type="text" class="form-control" id="transaction-hash" />
                    </div>
                    <button type="submit" class="btn btn-primary">Read message</button>
                </form>
                <div class="mt-4">
                    <span>Decoded message</span>
                    <p id="read-result" class="border rounded p-2"></p>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<style scoped>
    .col {
        padding-top: 1rem;
        padding-bottom: 1rem;
    }

    .complementary-section {
        background-color: var(--brand-clear-blue);
        padding-left: 1.5rem;
        padding-right: 1.5rem;
    }
</style>

<script lang="ts">
export default {
    computed: {},

    mounted() {
    },

    data() {
        return {
        };
    },
};
</script>