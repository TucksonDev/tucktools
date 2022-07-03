<script setup lang="ts"></script>

<template>
    <div class="fie-container border" :id="`${containerId}`"></div>
</template>

<style>
    .FIE_topbar-save-wrapper {
        display: none !important;
    }

    .fie-container {
        width: 550px;
        height: 600px;
    }

    .FIE_canvas-container canvas {
        border: 1px solid rgb(93, 109, 126) !important;
    }
</style>

<script lang="ts">
    // Default ID
    const defaultId = "fie-editor";

    // FIE class and props
    const FilerobotImageEditor = window.FilerobotImageEditor;
    const { TABS, TOOLS } = FilerobotImageEditor;

    // FIE handler
    let filerobotImageEditor: any;

    export default {
        name: "FilerobotImageEditor",
        props: {
            containerId: {
                type: String,
                default: defaultId
            }
        },
        components: {},
        computed: {},
        mounted() {
            this.init();
        },
        methods: {
            init: function() {
                // Container where to render FIE
                let containerId = this.containerId ?? defaultId;

                // Initalization and configuration
                const FIEContainer = document.getElementById(containerId);
                const FIEConfig = {
                    source: "https://nft-common-assets.s3.eu-west-2.amazonaws.com/solid-gray-bg.png",
                    avoidChangesNotSavedAlertOnLeave: true,
                    Text: { text: 'Add your text here, press Enter to finish.' },
                    tabsIds: [TABS.ANNOTATE, TABS.ADJUST, TABS.FILTERS],
                    defaultTabId: TABS.ANNOTATE,
                    defaultToolId: TOOLS.TEXT,
                };
                
                // Instantiation
                filerobotImageEditor = new FilerobotImageEditor(
                    FIEContainer,
                    FIEConfig
                );
                
                // Render editor
                filerobotImageEditor.render();
            },

            getImageData: function() {
                let currentImage = filerobotImageEditor.getCurrentImgData();
                return currentImage.imageData;
            }
        },
        expose: ['getImageData'],
        data() {
            return {
            };
        },
    };
</script>