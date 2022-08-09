<script setup lang="ts">
    import { SocialNetworks, TippingWallets } from "../constants";
</script>

<template>
    <footer class="bd-footer py-4 py-md-5 mt-5 bg-dark text-white">
        <div class="container">
            <div class="row">
                <div class="col-4">
                    <h5>TuckTools</h5>
                    <ul class="nav list-unstyled d-flex justify-content-start social-networks">
                        <li>
                            <a :href="SocialNetworks.TWITTER" target="_blank" class="text-muted" title="Twitter">
                                <i class="bi bi-twitter"></i>
                            </a>
                        </li>
                        <li class="ms-3">
                            <a :href="SocialNetworks.GITHUB" target="_blank" class="text-muted" title="GitHub">
                                <i class="bi bi-github"></i>
                            </a>
                        </li>
                        <li class="ms-3">
                            <a :href="SocialNetworks.LINKTREE" target="_blank" class="text-muted" title="Linktree">
                                <i class="bi bi-link-45deg"></i>
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="col-8 text-end">
                    <p>
                        If you like what I do, consider buying me a coffee:<br />
                        {{ TippingWallets.ENS }}
                    </p>
                    <!--
                        <ul class="list-unstyled">
                        <li class="mb-2">
                            BTC: <span>{{ TippingWallets.BTC }}</span>
                            <a @click="copyAddress"><i class="bi bi-files"></i></a>
                        </li>
                        <li class="mb-2">
                            ETH, Polygon and BSC: <span>{{ TippingWallets.ETH }}</span>
                            <a @click="copyAddress"><i class="bi bi-files"></i></a>
                        </li>
                        <li class="mb-2">
                            SOL: <span>{{ TippingWallets.SOL }}</span>
                            <a @click="copyAddress"><i class="bi bi-files"></i></a>
                        </li>
                        <li class="mb-2">
                            ALGO: <span>{{ TippingWallets.ALGO }}</span>
                            <a @click="copyAddress"><i class="bi bi-files"></i></a>
                        </li>
                    </ul>
                    -->
                </div>
            </div>
        </div>
    </footer>
</template>

<style>
    .social-networks i {
        font-size: 1.5rem;
        color: white;
    }
</style>
