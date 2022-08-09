<script setup lang="ts">
    import Web3Connect from "./Web3Connect.vue";
</script>

<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container">
            <button
                class="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarMainMenu"
                aria-controls="navbarMainMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <router-link to="/" class="navbar-brand">TuckTools</router-link>
            <div class="d-lg-none">
                <Web3Connect />
            </div>
            <div id="navbarMainMenu" class="collapse navbar-collapse">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item dropdown">
                        <a
                            id="simpleToolsDropdown"
                            class="nav-link dropdown-toggle"
                            href="#"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Simple Tools
                        </a>
                        <ul class="dropdown-menu" aria-labelledby="simpleToolsDropdown">
                            <li>
                                <router-link to="/sign-message/" class="dropdown-item"
                                    >Sign and verify messages</router-link
                                >
                            </li>
                            <li>
                                <router-link to="/send-chain-message/" class="dropdown-item"
                                    >Send and read on-chain messages</router-link
                                >
                            </li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <router-link to="/send-nft-message/" class="nav-link">Send NFT Message</router-link>
                    </li>
                    <!-- <li class="nav-item"><router-link to="/flipper-calculator/" class="nav-link">Flipper Calculator (Derisk+)</router-link></li> -->
                </ul>
            </div>
            <div class="d-none d-lg-block">
                <Web3Connect />
            </div>
        </div>
    </nav>
</template>

<style scoped>
    @media all and (min-width: 992px) {
        .navbar .nav-item .dropdown-menu {
            display: none;
        }
        .navbar .nav-item:hover .dropdown-menu {
            display: block;
        }
        .navbar .nav-item .dropdown-menu {
            margin-top: 0;
        }
    }
</style>
