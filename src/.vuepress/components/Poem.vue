<script setup>
const poems = [
    {
        content: "路漫漫其修远兮，吾将上下而求索。",
        author: "战国 · 屈原 · 《离骚》"
    },
    {
        content: "长风破浪会有时，直挂云帆济沧海。",
        author: "唐 · 李白 · 《行路难》"
    },
    {
        content: "海上生明月，天涯共此时。",
        author: "唐 · 张九龄 · 《望月怀远》"
    },
    {
        content: "黑云压城城欲摧，甲光向日金鳞开。",
        author: "唐 · 李贺 · 《雁门太守行》"
    },
    {
        content: "忽如一夜春风来，千树万树梨花开。",
        author: "唐 · 岑参 · 《白雪歌送武判官归京》"
    },
    {
        content: "先天下之忧而忧，后天下之乐而乐。",
        author: "宋 · 范仲淹 · 《岳阳楼记》"
    },
    {
        content: "山重水复疑无路，柳暗花明又一村。",
        author: "宋 · 陆游 · 《游山西村》"
    },
    {
        content: "但愿人长久，千里共婵娟。",
        author: "宋 · 苏轼 · 《水调歌头·明月几时有》"
    },
    {
        content: "粉身碎骨浑不怕，要留清白在人间。",
        author: "明 · 于谦 · 《离骚》"
    },

]
</script>

<template>
    <div class="poem-list">
        <div v-for="(item, index) in poems" :key="index" class="poem-item">
            <p class="poem-content">{{ item.content }}</p>
            <p class="poem-author">{{ item.author }}</p>
            <hr v-if="index !== poems.length - 1" class="poem-divider" />
        </div>
    </div>
</template>

<style scoped>
.poem-item {
    margin-bottom: 1.5rem;
}

.poem-content {
    text-align: center;
    font-size: 1.3rem;
    font-weight: 500;
    margin-bottom: 0.5rem !important;
}

.poem-author {
    text-align: right;
    font-size: 1rem;
    margin: 0 !important;
    padding-right: 8%;
}

.poem-divider {
    border: 0;
    border-top: 1px dashed var(--vp-c-divider);
    width: 50%;
    margin: 1.3rem auto 0;
}
</style>