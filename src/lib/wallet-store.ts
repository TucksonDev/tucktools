// Vue ecosystem libraries
import { defineStore } from "pinia";
import { markRaw, reactive, DeepReadonly } from "vue";

// Web3 libraries
import Web3Modal from "web3modal";
import { JsonRpcProvider, Web3Provider } from "@ethersproject/providers";
// import WalletConnectProvider from "@walletconnect/web3-provider";

// Internal libraries
import { DEFAULT_NETWORK, getNetworkParams, networkIsValid } from "../constants";
import { switchNetwork } from "./web3-network-manager-func";

// Holds the state of the wallet connected to the dapp
interface WalletState {
    provider: JsonRpcProvider | null;
    address: string;
    isConnected: boolean;
    providerChainID: number;
    providerChainName: string;
    blockExplorerBaseUrl: string;
}

// Holds the functions available to manage the wallet connected to the dapp
interface WalletStore {
    state: DeepReadonly<WalletState>;
    connect(): Promise<Web3Provider>;
    disconnect(): void;
    hasCachedProvider(): boolean;
    checkWrongNetwork(): Promise<boolean>;
    walletIsReady(): boolean;
}

export const useWalletStore = defineStore("wallet", (): WalletStore => {
    const web3Modal: Web3Modal = new Web3Modal({
        cacheProvider: true,
        providerOptions: {
            /* walletconnect: {
                package: WalletConnectProvider,
                options: {
                    rpc: {
                        [DEFAULT_NETWORK]: getNetworkParams().rpcUrls[0],
                    },
                },
            }, */
        },
    });

    const state = reactive<WalletState>({
        provider: null,
        address: "",
        isConnected: false,
        providerChainID: DEFAULT_NETWORK,
        providerChainName: "",
        blockExplorerBaseUrl: "",
    });

    const changeNetwork = async (newChainID: number) => {
        const chainId = Number(newChainID);
        state.providerChainID = chainId;

        // Extra parameters
        const networkParameters = getNetworkParams(chainId);
        state.blockExplorerBaseUrl = networkParameters.blockExplorerUrls[0];
        state.providerChainName = networkParameters.chainName;
    };

    function _initWeb3ModalListeners(rawProvider: JsonRpcProvider): void {
        if (!rawProvider.on) {
            return;
        }

        if (!rawProvider.listeners("accountsChanged").length) {
            rawProvider.on("accountsChanged", async () => {
                if (!state.isConnected || !state.provider) {
                    return;
                }

                const connectedAddress = await state.provider.getSigner().getAddress();
                state.address = connectedAddress;
            });
        }

        /*
        rawProvider.off("chainChanged");
        rawProvider.on("chainChanged", async (chainId: number) => {
            console.log("Chain changed", chainId)
        });
        */
    }

    function _initWeb3ProviderListeners(rawProvider: JsonRpcProvider): void {
        if (!rawProvider.on) {
            return;
        }

        rawProvider.on("network", (newNetwork, oldNetwork) => {
            if (!oldNetwork) return;
            if (state.isConnected) {
                changeNetwork(newNetwork.chainId);
            }
        });
    }

    async function connect(): Promise<Web3Provider> {
        // Get the provider from web3modal
        const rawProvider = await web3Modal.connect();

        // Initialize Web3Modal listeners
        _initWeb3ModalListeners(rawProvider);

        // Initialize the Web3provider object
        // https://docs.ethers.io/v5/api/providers/other/#Web3Provider
        const connectedProvider = new Web3Provider(rawProvider, "any");
        state.provider = markRaw(connectedProvider);
        state.isConnected = true;

        // Initialize Web3Provider listeners
        _initWeb3ProviderListeners(connectedProvider);

        // Saving the state variables
        const chainId = await connectedProvider.getNetwork().then((network) => Number(network.chainId));
        state.providerChainID = chainId;

        const connectedAddress = await connectedProvider.getSigner().getAddress();
        state.address = connectedAddress;

        // Extra parameters
        const networkParameters = getNetworkParams(chainId);
        state.blockExplorerBaseUrl = networkParameters.blockExplorerUrls[0];
        state.providerChainName = networkParameters.chainName;

        return connectedProvider;
    }

    const checkWrongNetwork = async (): Promise<boolean> => {
        if (!networkIsValid(state.providerChainID)) {
            const shouldSwitch = window.confirm("Switch to Ethereum network?");
            if (shouldSwitch) {
                await switchNetwork();
            }
            return true;
        }

        return false;
    };

    function disconnect(): void {
        web3Modal.clearCachedProvider();

        state.provider = null;
        state.address = "";
        state.isConnected = false;
        state.providerChainID = DEFAULT_NETWORK;
        state.providerChainName = "";
        state.blockExplorerBaseUrl = "";
    }

    function hasCachedProvider(): boolean {
        if (!web3Modal) return false;
        if (!web3Modal.cachedProvider) return false;
        return true;
    }

    function walletIsReady(): boolean {
        return state.isConnected && networkIsValid(state.providerChainID);
    }

    return {
        connect,
        disconnect,
        hasCachedProvider,
        checkWrongNetwork,
        walletIsReady,
        state,
    };
});
