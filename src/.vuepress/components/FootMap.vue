<template>
    <div class="footprint-map" :data-json="dataUrl" :data-amap-key="amapKey"></div>
</template>

<script setup>
import { onMounted } from "vue";

const props = defineProps({
    amapKey: {
        type: String,
        default: "04fc0ff41d59b411e57496afb25fea89",
    },
    dataUrl: {
        type: String,
        default: "/assets/data/footprints.json",
    },
    highlightMode: {
        type: String,
        default: "visited", // 'none' | 'hover' | 'visited'
    },
});

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const loadCSS = (href) => {
    return new Promise((resolve) => {
        const existing = document.querySelector(`link[href="${href}"]`);
        if (existing) {
            resolve();
            return;
        }
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.onload = resolve;
        document.head.appendChild(link);
    });
};

onMounted(async () => {
    try {
        // 加载 CSS
        await loadCSS("/css/footprintmap.css");

        // 设置高亮模式
        if (window.FootprintMap && window.FootprintMap.CONFIG) {
            window.FootprintMap.CONFIG.HIGHLIGHT.mode = props.highlightMode;
        }

        // 加载 JS 文件
        await loadScript("/js/footprintmap/utils.js");
        await loadScript("/js/footprintmap/footprintmap.js");

        // 根据高亮模式加载插件
        if (props.highlightMode === "hover") {
            await loadScript("/js/footprintmap/plugin-hover.js");
        } else if (props.highlightMode === "visited") {
            await loadScript("/js/footprintmap/plugin-visited.js");
        }

        // 初始化地图
        if (window.FootprintMap) {
            window.FootprintMap.init();
        }
    } catch (error) {
        console.error("地图加载失败:", error);
    }
});
</script>

<style scoped>
.footprint-map {
    width: 100%;
    height: 700px;
    border-radius: 12px;
    overflow: hidden;
}
</style>
