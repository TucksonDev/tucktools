///////
// This file contains constants that are always loaded regardless of the environment
///////

// Tokenomics
export const TOKEN_DECIMALS = 18;

// EVM Networks
export enum Networks {
    ETH_MAINNET = 1,
    ETH_RINKEBY = 4,
}
export const getNetwork = (network: string = import.meta.env.VITE_BLOCKCHAIN_NETWORK) => {
    switch (network) {
        case "eth_rinkeby":
            return Networks.ETH_RINKEBY;

        case "eth_mainnet":
        default:
            return Networks.ETH_MAINNET;
    }
};
export const DEFAULT_NETWORK = getNetwork();

export const networkIsValid = (providerId: number): boolean => {
    return Object.values(Networks).includes(providerId);
};

// EVM Network Params
export const getNetworkParams = (network: Networks = DEFAULT_NETWORK) => {
    const ethMainnetParams = {
        chainId: `0x${Networks.ETH_MAINNET.toString(16)}`,
        chainName: "Mainnet",
        blockExplorerUrls: ["https://etherscan.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: TOKEN_DECIMALS,
        },
    };

    const ethRinkebyParams = {
        chainId: `0x${Networks.ETH_RINKEBY.toString(16)}`,
        chainName: "Rinkeby",
        blockExplorerUrls: ["https://rinkeby.etherscan.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: TOKEN_DECIMALS,
        },
    };

    const unknownChainParams = {
        chainName: "Unsupported",
        blockExplorerUrls: "",
    };

    switch (network) {
        case Networks.ETH_MAINNET:
            return ethMainnetParams;
        case Networks.ETH_RINKEBY:
            return ethRinkebyParams;

        default:
            return unknownChainParams;
    }
};

// Contracts
export const MESSAGENFT_CONTRACT_ID = 1;

export const getContractAddress = (contract_id: number, network: Networks = DEFAULT_NETWORK) => {
    switch (contract_id) {
        /////////////////
        // Message NFT //
        /////////////////
        case MESSAGENFT_CONTRACT_ID:
            switch (network) {
                case Networks.ETH_RINKEBY:
                    return "0x4904a5D49DD25e68e89dd9654C757a05bD1790Ff";

                case Networks.ETH_MAINNET:
                default:
                    return "0xc62E3F02ED11E4f95ff8c8FC451882378C2fdba5";
            }
    }
};
