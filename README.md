# TuckTools Front
Tools to perform operations on the Ethereum blockchain.

## Why
These tools have been created essentially to demonstrate my technical skills. They are all free to use, except for gas fees when applicable. More tools will be available over time. All the code for this website, the backend and the associated smartcontracts is available in my Github repository. I love feedback, so do not hesitate to drop a comment via DM on Twitter.

## Disclaimer
These tools have been created to demonstrate my technical skills. They have all been thoroughly tested by me, but no third party has been involved in testing/auditing any of the code. Please keep this in mind when using them, as I am not responsible for any misuse of, or damage caused by, these tools.

# Technical specifications
- Base technologies for this project are: Vue 3 + Vite + Typescript, using the standard Vite scaffolding tool. More info [here](https://vitejs.dev/guide/).
- Bootstrap has been added as a standalone library, and not as a vue module
- Vue-router is used to handle routing
- Pinia is used as a store manager
- Sass is used as the CSS Preprocessor
- To handle web3 interactions, the project uses web3modal (to handle wallet connection) and ethers (to handle blockchain-related operations). For now, only mainnet and goerli are supported.
- Operations that require external api access with api keys are called through the backend API, which is accessed using axios
- Environment variables are set in .env for all environments and .env.production for overriding variables on production. When running `npm run build` variables in .env.production will override variables in .env .
- Google Analytics can be activated by setting the environment variable VITE_GA_ID

# Associated services
- A backend API is required for the tools that need to access third party token-gated APIs. The base endpoint of this backend is specified in the .env file, which is then specified on axios queries. An implementation of this API can be found [here](https://github.com/TucksonDev/tucktools-server).
- A smartcontract for sending messages as NFTs is used in the related tool. The address of this smartcontract can be configured in `src/constants/blockchain.ts` and its abi should be present in `assets/abis/messagenft.json`. An implementation of this smartcontract can be found [here](https://github.com/TucksonDev/nftmessage-smartcontract).

# CLI instructions
- `npm install` : To install all dependencies
- `npm run dev` : To initialize the web server daemon for development
- `npm run lint` : To view linting and formatting problems on the project
- `npm run lint:fix` : To fix linting and formatting problems on the project
- `npm run build` : To generate and pack production files


# References
- Vite: https://vitejs.dev/guide/
- Vue 3: https://vuejs.org/guide/quick-start.html
- Bootstrap: https://getbootstrap.com/docs/5.2/getting-started/introduction/
- Vue-router: https://router.vuejs.org/guide/
- Pinia: https://pinia.vuejs.org/introduction.html
- Sass: https://sass-lang.com/documentation/
- Web3Modal: https://github.com/Web3Modal/web3modal
- Ethers: https://docs.ethers.io/v5/
- Axios: https://axios-http.com/docs/intro
