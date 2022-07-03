<script setup lang="ts">
    import TopNavbar from '../../components/TopNavbar.vue';
    import Footer from '../../components/Footer.vue';
    import { SocialNetworks } from "../../constants";
</script>

<template>
    <TopNavbar />

    <div class="bd-masthead mb-3 pt-4">
        <div class="container bd-gutter">
            <div class="row">
                <div class="col-12 text-center">
                    <h1>Welcome to TuckTools</h1>
                    <p class="lead mb-4">
                        Tools to perform operations on the Ethereum blockchain
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="container bd-gutter masthead-followup">
        <section class="row mb-5 align-items-center">
            <div class="col-12">
                <h2 class="mb-3 fw-semibold">Why?</h2>
                <p class="lead fw-normal">
                    These tools have been created essentially to demonstrate my technical skills.
                    They are all free to use, except for gas fees when applicable.
                    More tools will be available over time.
                    All the code for this website, the backend and the associated
                    smartcontracts is available in my
                    <a :href="SocialNetworks.GITHUB" target="_blank">Github</a>
                    repository.
                    I love feedback, so do not hesitate to drop a comment via DM on
                    <a :href="SocialNetworks.TWITTER" target="_blank">Twitter</a>
                    and, if you're feeling generous, consider buying me a
                    coffee via any of the tipping options available at the footer.<br />
                    Thank you !
                </p>
            </div>
        </section>

        <section class="row mb-5 align-items-center">
            <div class="col-12">
                <h2 class="mb-3 fw-semibold">About me</h2>
                <p class="lead fw-normal">
                    I'm a fullstack web2 developer with 15+ years of experience,
                    moving to Blockchain and web3. I enjoy creating tools for automating
                    processes and learning about how blockchain technology is shaping the
                    future of our world.
                    You can follow me on
                    <a :href="SocialNetworks.TWITTER" target="_blank">Twitter</a>
                    where I share news about crypto and
                    technical articles about the technology behind them.
                </p>
            </div>
        </section>

        <section class="row border border-3 border-danger rounded mb-5 align-items-center">
            <div class="col-12">
                <h2 class="mb-3 fw-semibold">Disclaimer</h2>
                <p class="lead fw-normal">
                    These tools have been created to demonstrate my technical skills.
                    They have all been thoroughly tested by me, but no third party has been
                    involved in testing/auditing any of the code.
                    Please keep this in mind when using them, as I am not responsible for
                    any misuse of, or damage caused by, these tools.
                </p>
            </div>
        </section>
    </div>

    <Footer />
</template>

<style>
    .bd-masthead h1 {
        font-size: 4rem;
        font-weight: 600;
    }

    .bd-masthead .lead {
        font-size: 1.5rem;
        font-weight: 400;
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