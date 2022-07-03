<script setup lang="ts">
    import TopNavbar from '../../components/TopNavbar.vue';
    import Footer from '../../components/Footer.vue';
    import { AppMessages } from '../../messages/messages';
    import { useWalletStore } from '../../lib/wallet-store';
import { ethers } from 'ethers';

    // Constants
    const wallet = useWalletStore();

    const signMessage = async (message: string): Promise<string> => {
        if (
            !wallet.walletIsReady() ||
            !wallet.state.provider
        ) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            console.log(AppMessages.WalletNotConnectedErrorMessage);
            return '';
        }

        let signedMessage = null;

        try {
            const signer = await wallet.state.provider.getSigner();
            signedMessage = await signer.signMessage(message);
            return signedMessage;
        } catch (error) {
            alert(AppMessages.BlockchainConnectionErrorMessage);
            throw error;
        }
    }

    let requestSignature = async () => {
        if (
            !wallet.walletIsReady() ||
            !wallet.state.provider
        ) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            console.log(AppMessages.WalletNotConnectedErrorMessage);
            return '';
        }

        let textToSign = (<HTMLInputElement>document.getElementById('message-to-sign'))?.value;
        if (!textToSign) {
            alert(AppMessages.AllFieldsRequiredErrorMessage);
            return;
        }

        let resultBox = document.getElementById('signing-result');
        let signedMessage = await signMessage(textToSign);

        if (resultBox && signedMessage) {
            resultBox.innerHTML = signedMessage;
        }
    }

    let verifySignature = () => {
        let rawMessage = (<HTMLInputElement>document.getElementById('raw-message'))?.value;
        let hashedMessage = (<HTMLInputElement>document.getElementById('hashed-message'))?.value;
        let givenSignerAddress = (<HTMLInputElement>document.getElementById('signer-address'))?.value;

        if (!rawMessage || !hashedMessage || !givenSignerAddress) {
            alert(AppMessages.AllFieldsRequiredErrorMessage);
            return;
        }

        if (!ethers.utils.isHexString(hashedMessage, 65) || !ethers.utils.isBytesLike(hashedMessage)) {
            alert("Hashed message does not have the right format or length");
            return;
        }

        if (!ethers.utils.isAddress(givenSignerAddress)) {
            alert(AppMessages.EthAddressIsNotValidFormat);
            return;
        }

        let signingAddress = null;
        try {
            signingAddress = ethers.utils.verifyMessage(rawMessage, hashedMessage);
        } catch (error) {
            alert(AppMessages.GeneralErrorMessage);
            throw error;
        }
        
        let resultBox = document.getElementById('verification-result');
        if (resultBox && signingAddress) {
            let lowerSigningAddress = signingAddress.toLowerCase();
            let lowerGivenSignerAddress = givenSignerAddress.toLowerCase();
            let message = '';

            if (lowerSigningAddress === lowerGivenSignerAddress) {
                message = 'Verification: Success!<br />This message has been signed by the given address: ' + lowerSigningAddress;
            } else {
                message = 'Verification: FAILED<br />This message has NOT been signed by the given address. Signer for the given message and hash is: ' + lowerSigningAddress;
            }

            resultBox.innerHTML = message;
        }
    }
</script>

<template>
    <TopNavbar />

    <div class="container main-container">
        <div class="row">
            <div class="col">
                <div class="section-title mb-4">
                    <h1>Sign a message</h1>
                </div>
                <div class="section-intro">
                    <p>
                        Write the message you want to sign and click "Sign". This will trigger Metamask to
                        sign the message and it will return the hash of the signed message.
                    </p>
                </div>
                <form @submit.prevent="requestSignature">
                    <div class="mb-4">
                        <label for="message-to-sign">Message to sign</label>
                        <textarea class="form-control" id="message-to-sign" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Sign</button>
                </form>
                <div class="mt-4">
                    <span>Hash of signed message</span>
                    <p id="signing-result" class="border rounded p-2"></p>
                </div>
            </div>

            <div class="col offset-md-1 complementary-section">
                <div class="section-title mb-4">
                    <h1>Verify a signed message</h1>
                </div>
                <div class="section-intro">
                    <p>
                        You can verify a signed message here. Write the message, the hash and the
                        signed address to verify whether the hash corresponds to the message signed
                        by the given address.
                    </p>
                </div>
                <form @submit.prevent="verifySignature">
                    <div class="mb-4">
                        <label for="signer-address">Signer address</label>
                        <input class="form-control" id="signer-address" />
                    </div>
                    <div class="mb-4">
                        <label for="raw-message">Message</label>
                        <textarea class="form-control" id="raw-message" rows="3"></textarea>
                    </div>
                    <div class="mb-4">
                        <label for="hashed-message">Hashed message</label>
                        <textarea class="form-control" id="hashed-message" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Verify</button>
                </form>
                <div class="mt-4">
                    <span>Result</span>
                    <p id="verification-result" class="border rounded p-2"></p>
                </div>
            </div>
        </div>
    </div>

    <Footer />
</template>

<style scoped>
    #signing-result {
        word-break: break-all;
    }

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