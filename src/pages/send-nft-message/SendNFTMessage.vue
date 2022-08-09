<script setup lang="ts">
    import { onMounted } from "vue";
    import { ethers } from "ethers";
    import axios from "axios";
    import TopNavbar from "../../components/TopNavbar.vue";
    import FooterTemplate from "../../components/FooterTemplate.vue";
    import FilerobotImageEditor from "../../components/FilerobotImageEditor.vue";
    import { AppMessages } from "../../messages/messages";
    import { useWalletStore } from "../../lib/wallet-store";
    import { getContractAddress, MESSAGENFT_CONTRACT_ID, IPFS_BASE_URL } from "../../constants";
    import messagenftAbi from "../../assets/abis/messagenft.json";

    // Constants
    const wallet = useWalletStore();

    //
    // Helper functions
    //
    const getBlobFromCanvas = (canvasElem: HTMLCanvasElement): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            canvasElem.toBlob((blob: any) => {
                resolve(blob);
            });
        });
    };

    const preventSubmit = () => {
        console.log("Preventing submission");
        // TODO: Find a way to avoid having this event method.
        //      Filerobot Image Editor, when using the Image tool, draws a button to choose the image.
        //      When clicking that button, form is submitted.
    };

    //
    // Main flow
    //
    let sendNFTMessage = async () => {
        // We first verify whether the wallet is connected.
        // Otherwise we might end up sending a file to IPFS and failing the flow later.
        if (!wallet.walletIsReady() || !wallet.state.provider) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            console.log(AppMessages.WalletNotConnectedErrorMessage);
            return;
        }

        if (!fieCompRef || !fieCompRef.getImageData) {
            throw Error(AppMessages.FIENotloadedErrorMessage);
        }

        let imageInformation = fieCompRef.getImageData();
        if (!imageInformation) {
            throw Error(AppMessages.FIENotloadedErrorMessage);
        }

        let imageBlob = await getBlobFromCanvas(imageInformation.imageCanvas);
        if (!imageBlob) {
            throw Error(AppMessages.FIENotloadedErrorMessage);
        }

        // Get the rest of the information
        let recipientAddress = (<HTMLInputElement>document.getElementById("recipient-address"))?.value;
        let nftTitle = (<HTMLInputElement>document.getElementById("nft-title"))?.value;
        let nftDescription = (<HTMLInputElement>document.getElementById("nft-description"))?.value;
        if (!recipientAddress || !nftTitle || !nftDescription) {
            alert(AppMessages.AllFieldsRequiredErrorMessage);
            return;
        }

        if (!ethers.utils.isAddress(recipientAddress)) {
            alert(AppMessages.EthAddressIsNotValidFormat);
            return;
        }

        // Uploading the metadata to IPFS
        let ipfsCid = await uploadMetadataToIPFS(nftTitle, nftDescription, imageBlob);
        if (!ipfsCid) {
            return;
        }

        // Send the transaction
        let resultBox = document.getElementById("sending-result");
        let transactionHash = await sendMessageByNFT(ipfsCid, recipientAddress);
        if (resultBox && transactionHash) {
            const linkUrl = wallet.state.blockExplorerBaseUrl + "/tx/" + transactionHash;
            resultBox.innerHTML =
                "The transaction has been sent to the blockchain, you can see its status " +
                "<a href='" +
                linkUrl +
                "' target='_blank'>by clicking here</a>.";
        }
    };

    let uploadMetadataToIPFS = async (nftName: string, nftDescription: string, fileBlob: Blob): Promise<string> => {
        try {
            let axiosData = new FormData();
            axiosData.append("fileBlob", fileBlob);
            axiosData.append("nftName", nftName);
            axiosData.append("nftDescription", nftDescription);

            const axiosResponse = await axios.post(import.meta.env.VITE_BACKEND_ROOT + "/ipfs", axiosData);

            return axiosResponse.data;
        } catch (error) {
            alert(AppMessages.SendBackendRequestErrorMessage);
            throw error;
        }
    };

    const sendMessageByNFT = async (ipfsCid: string, recipient: string): Promise<string> => {
        if (!wallet.walletIsReady() || !wallet.state.provider) {
            alert(AppMessages.WalletNotConnectedErrorMessage);
            throw Error(AppMessages.WalletNotConnectedErrorMessage);
        }

        try {
            // Get the contract information
            const messagenftAddress = getContractAddress(MESSAGENFT_CONTRACT_ID, wallet.state.providerChainID);
            if (!messagenftAddress || !messagenftAbi) {
                alert(AppMessages.BlockchainConnectionErrorMessage);
                throw Error(AppMessages.BlockchainConnectionErrorMessage);
            }

            const signer = await wallet.state.provider.getSigner();
            const messagenftContract = new ethers.Contract(messagenftAddress, messagenftAbi, signer);

            const transactionResponse = await messagenftContract.mint(recipient, IPFS_BASE_URL + ipfsCid);

            transactionResponse.wait().then((transactionReceipt: { transactionHash: string }) => {
                showTransactionConfirmation(transactionReceipt.transactionHash);
            });

            return transactionResponse.hash;
        } catch (error) {
            alert(AppMessages.BlockchainConnectionErrorMessage);
            throw error;
        }
    };

    let showTransactionConfirmation = (transactionHash: string) => {
        let resultBox = document.getElementById("sending-result");
        if (resultBox) {
            const linkUrl = wallet.state.blockExplorerBaseUrl + "/tx/" + transactionHash;
            resultBox.innerHTML =
                "NFT sent! The transaction has been confirmed and the NFT is in the recipient's wallet. " +
                "It might take a few minutes to appear on OpenSea. You can see the transaction " +
                "<a href='" +
                linkUrl +
                "' target='_blank'>by clicking here</a>.";
        }
    };

    //
    // Modal handler
    //
    onMounted(() => {
        const nftPreviewModal = document.getElementById("nftPreviewModal");
        nftPreviewModal?.addEventListener("shown.bs.modal", (event) => {
            if (!fieCompRef || !fieCompRef.getImageData) {
                // Something happened with the FIE Component
                throw Error(AppMessages.FIENotloadedErrorMessage);
            }

            let nftPreviewImageElement = <HTMLImageElement>document.getElementById("nft-preview-img");
            let spinnerElement = document.getElementById("preview-spinner");
            let imageInformation = fieCompRef.getImageData();

            if (nftPreviewImageElement && spinnerElement) {
                nftPreviewImageElement.src = imageInformation.imageBase64;
                spinnerElement.style.display = "none";
            }
        });
        nftPreviewModal?.addEventListener("hidden.bs.modal", (event) => {
            if (!fieCompRef || !fieCompRef.getImageData) {
                // Something happened with the FIE Component
                throw Error(AppMessages.FIENotloadedErrorMessage);
            }

            let nftPreviewImageElement = <HTMLImageElement>document.getElementById("nft-preview-img");
            let spinnerElement = document.getElementById("preview-spinner");

            if (nftPreviewImageElement && spinnerElement) {
                nftPreviewImageElement.src = "";
                spinnerElement.style.display = "block";
            }
        });
    });
</script>

<template>
    <TopNavbar />

    <div class="container main-container">
        <div class="section-title mb-4">
            <h1>Send a message via NFT</h1>
        </div>
        <div class="section-intro mb-5">
            <p>
                Create the image you want using the editor. You can upload images (Draw > Image), add text (Draw >
                Text), add shapes, crop the picture, apply filters, ... Once you are happy with the result, specify the
                recipient address, the title and the description for the NFT. Clicking "Send" will trigger Metamask to
                call the contract responsible for handling these NFTs. Keep in mind that you will need to pay gas fees
                in order to send the transaction. The recipient will receive the NFT in their wallet, and it will be
                visible on OpenSea.
            </p>
        </div>

        <form @submit.prevent="preventSubmit">
            <div class="row">
                <div class="col-md-6">
                    <div>
                        <FilerobotImageEditor ref="fieComp" />
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-4">
                        <label for="recipient-address">Recipient address</label>
                        <input id="recipient-address" type="text" class="form-control" />
                    </div>
                    <div class="mb-4">
                        <label for="nft-title">Title of the NFT</label>
                        <input id="nft-title" type="text" class="form-control" />
                    </div>
                    <div class="mb-4">
                        <label for="nft-description">Description of the NFT</label>
                        <textarea id="nft-description" class="form-control" rows="5"></textarea>
                    </div>
                    <div class="text-center button-box">
                        <div>
                            <button
                                type="button"
                                class="btn btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#nftPreviewModal"
                            >
                                Preview
                            </button>
                            <button type="button" class="btn btn-primary" @click="sendNFTMessage">Send</button>
                        </div>
                    </div>
                    <div class="mt-4">
                        <span>Result</span>
                        <p id="sending-result" class="border rounded p-2"></p>
                    </div>
                </div>
            </div>
        </form>
    </div>

    <!-- NFT Preview Modal -->
    <div
        id="nftPreviewModal"
        class="modal fade"
        tabindex="-1"
        aria-labelledby="nftPreviewModalLabel"
        aria-hidden="true"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 id="nftPreviewModalLabel" class="modal-title">NFT Preview</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p>This is how your NFT will look like</p>
                    <div>
                        <div id="preview-spinner" class="spinner-border" role="status"></div>
                        <img id="nft-preview-img" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <FooterTemplate />
</template>

<script lang="ts">
    // Reference to the child component
    let fieCompRef: any;

    export default {
        data() {
            return {};
        },
        computed: {},
        mounted() {
            fieCompRef = this.$refs.fieComp;
        },
    };
</script>

<style scoped>
    .button-box button {
        margin: 0 0.5em;
    }
    #nft-preview-img {
        width: 100%;
    }
</style>
