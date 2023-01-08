///////
// This file contains constants that are always loaded regardless of the environment
///////

// Tokenomics
export const TOKEN_DECIMALS = 18;

// EVM Networks
export enum Networks {
    ETH_MAINNET = 1,
    ETH_GOERLI = 5,
    POLYGON_MAINNET = 137,
}
export const getNetwork = (network: string = import.meta.env.VITE_BLOCKCHAIN_NETWORK) => {
    switch (network) {
        case "polygon_mainnet":
            return Networks.POLYGON_MAINNET;

        case "eth_goerli":
            return Networks.ETH_GOERLI;

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

    const ethGoerliParams = {
        chainId: `0x${Networks.ETH_GOERLI.toString(16)}`,
        chainName: "Goerli",
        blockExplorerUrls: ["https://goerli.etherscan.io"],
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH",
            decimals: TOKEN_DECIMALS,
        },
    };

    const polygonMainnetParams = {
        chainId: `0x${Networks.POLYGON_MAINNET.toString(16)}`,
        chainName: "Polygon",
        blockExplorerUrls: ["https://polygonscan.com"],
        nativeCurrency: {
            name: "Matic",
            symbol: "MATIC",
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
        case Networks.ETH_GOERLI:
            return ethGoerliParams;
        case Networks.POLYGON_MAINNET:
            return polygonMainnetParams;

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
                case Networks.POLYGON_MAINNET:
                    return "0xc62E3F02ED11E4f95ff8c8FC451882378C2fdba5";

                case Networks.ETH_GOERLI:
                    return "0x4904a5D49DD25e68e89dd9654C757a05bD1790Ff";

                case Networks.ETH_MAINNET:
                default:
                    return "0xc62E3F02ED11E4f95ff8c8FC451882378C2fdba5";
            }
    }
};
