<template>
    <div class="movie-collection-container">
        <div class="header">
            <h2>🎬 电影</h2>
            <p class="subtitle">
                喜欢港片、武侠片、恐怖片（越菜越爱玩）. 共收藏
                {{ movieList.length }} 部影片
            </p>
        </div>
        <div class="movie-grid">
            <div v-for="movie in movieList" class="movie-grid-item">
                <div class="poster-wrapper">
                    <img :src="movie.poster" :alt="movie.title" loading="lazy" />
                    <span class="status-badge">{{ movie.status }}</span>
                    <div class="movie-overlay-info">
                        <!-- 标题 -->
                        <h3 class="movie-title">{{ movie.title }}</h3>
                        <div class="meta-row">
                            <div class="rating-stars">
                                <span v-for="(type, index) in getStars(movie.score)" :key="index" class="star-icon"
                                    :class="type">★</span>
                                <span class="score-num">{{ movie.score }}</span>
                            </div>
                        </div>
                        <!-- 日期 -->
                        <span class="watch-date">{{ movie.date }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="header">
            <h2>📺️ 电视剧</h2>
            <p class="subtitle">
                老电视剧yyds，童年回忆 . 共收藏 {{ tvList.length }} 部电视剧
            </p>
        </div>
        <div class="movie-grid">
            <div v-for="tv in tvList" class="movie-grid-item">
                <div class="poster-wrapper">
                    <img :src="tv.poster" :alt="tv.title" loading="lazy" />
                    <span class="status-badge">{{ tv.status }}</span>
                    <div class="movie-overlay-info">
                        <!-- 标题 -->
                        <h3 class="movie-title">{{ tv.title }}</h3>
                        <div class="meta-row">
                            <div class="rating-stars">
                                <span v-for="(type, index) in getStars(tv.score)" :key="index" class="star-icon"
                                    :class="type">★</span>
                                <span class="score-num">{{ tv.score }}</span>
                            </div>
                        </div>
                        <!-- 日期 -->
                        <span class="watch-date">{{ tv.date }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref } from "vue";

// 电影列表
const movieList = ref([
    {
        title: "熊出没·年年有熊",
        poster: "https://img.haipeng-lin.cn/1781157018744.png",
        score: 5,
        date: "2026-6-6",
        status: "超棒",
    },
    {
        title: "伪钞重案",
        poster: "https://img.haipeng-lin.cn/1778895786581.png",
        score: 2,
        date: "2026-5-15",
        status: "已看",
    },
    {
        title: "飞驰人生2",
        poster: "https://img.haipeng-lin.cn/1778895605968.png",
        score: 5,
        date: "2026-5-14",
        status: "已看",
    },
    {
        title: "飞驰人生",
        poster: "https://img.haipeng-lin.cn/1778895722251.png",
        score: 4,
        date: "2026-5-13",
        status: "已看",
    },
    {
        title: "寒战1994",
        poster: "https://img.haipeng-lin.cn/1778047054473.png",
        score: 5,
        date: "2026-5-1",
        status: "已看",
    },
    {
        title: "飞驰人生3",
        poster: "https://img.haipeng-lin.cn/1778047179394.png",
        score: 4,
        date: "2026-4-30",
        status: "已看",
    },
    {
        title: "喋血双雄",
        poster: "https://img.haipeng-lin.cn/1777257789195.png",
        score: 4,
        date: "2026-4-26",
        status: "已看",
    },
    {
        title: "辣手神探",
        poster: "https://img.haipeng-lin.cn/1777257139775.png",
        score: 4,
        date: "2026-4-26",
        status: "已看",
    },
    {
        title: "英雄本色2",
        poster: "https://img.haipeng-lin.cn/1777257930354.png",
        score: 4.5,
        date: "2026-4-21",
        status: "已看",
    },
    {
        title: "英雄本色",
        poster: "https://img.haipeng-lin.cn/1777257892497.png",
        score: 5,
        date: "2026-4-20",
        status: "已看",
    },
    {
        title: "爱·作战",
        poster: "https://img.haipeng-lin.cn/20251009234340.png",
        score: 5,
        date: "2025-7",
        status: "已看",
    },
    {
        title: "的士判官",
        poster: "https://img.haipeng-lin.cn/20251009234411.png",
        score: 4,
        date: "2025-7",
        status: "已看",
    },
    {
        title: "龙虎风云",
        poster: "https://img.haipeng-lin.cn/20251009234435.png",
        score: 4.5,
        date: "2025-7",
        status: "已看",
    },
    {
        title: "猎金游戏",
        poster: "https://img.haipeng-lin.cn/20251009234509.png",
        score: 4,
        date: "2025-7",
        status: "已看",
    },
    {
        title: "常在我心",
        poster: "https://img.haipeng-lin.cn/20251009234536.png",
        score: 5,
        date: "2025-7",
        status: "已看",
    },
    {
        title: "铿钱家族",
        poster: "https://img.haipeng-lin.cn/20251009234606.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "每当变幻时",
        poster: "https://img.haipeng-lin.cn/20251207173427.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "神雕侠侣",
        poster: "https://img.haipeng-lin.cn/20251207173628.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "冲锋陷阵",
        poster: "https://img.haipeng-lin.cn/20251207181231.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "使徒行者",
        poster: "https://img.haipeng-lin.cn/20251207174408.png",
        score: 4.5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "卧虎藏龙",
        poster: "https://img.haipeng-lin.cn/20251207174420.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "英雄",
        poster: "https://img.haipeng-lin.cn/20251207174436.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "11",
        poster: "https://img.haipeng-lin.cn/20251207174540.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "新宿事件",
        poster: "https://img.haipeng-lin.cn/20251207180252.png",
        score: 4,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "罪迷宫",
        poster: "https://img.haipeng-lin.cn/20251207180305.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "死亡魔法",
        poster: "https://img.haipeng-lin.cn/20251207180412.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "太极张三丰",
        poster: "https://img.haipeng-lin.cn/20251207180428.png",
        score: 5,
        date: "2025-6",
        status: "已看",
    },
    {
        title: "破地狱",
        poster: "https://img.haipeng-lin.cn/20251207180440.png",
        score: 5,
        date: "2025-5",
        status: "已看",
    },
    {
        title: "误杀",
        poster: "https://img.haipeng-lin.cn/20251207180535.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "砰然心动",
        poster: "https://img.haipeng-lin.cn/20251207180551.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "唐探1990",
        poster: "https://img.haipeng-lin.cn/20251207180608.png",
        score: 3,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "古惑仔·胜者为王",
        poster: "https://img.haipeng-lin.cn/20251207180946.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "古惑仔·龙虎争霸",
        poster: "https://img.haipeng-lin.cn/20251207181002.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "古惑仔·战无不胜",
        poster: "https://img.haipeng-lin.cn/20251207181016.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },

    // 1
    {
        title: "英雄赤女",
        poster: "https://img.haipeng-lin.cn/20251207181809.png",
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "古惑仔·人在江湖",
        poster: "https://img.haipeng-lin.cn/20251207181847.png",
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "倩女幽魂·道道道",
        poster: "https://img.haipeng-lin.cn/20251207181902.png",
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "倩女幽魂·人间道",
        poster: "https://img.haipeng-lin.cn/20251207181916.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "倩女幽魂",
        poster: "https://img.haipeng-lin.cn/20251207181927.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "暗花",
        poster: "https://img.haipeng-lin.cn/20251207181943.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },

    // 1
    {
        title: "火龙",
        poster: "https://img.haipeng-lin.cn/20251207183240.png",
        score: 4,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "意外",
        poster: "https://img.haipeng-lin.cn/20251207183253.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "枪王之王",
        poster: "https://img.haipeng-lin.cn/20251207183305.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "枪王",
        poster: "https://img.haipeng-lin.cn/20251207183317.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "智齿",
        poster: "https://img.haipeng-lin.cn/20251207183335.png",
        score: 5,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "手卷烟",
        poster: "https://img.haipeng-lin.cn/20251207183349.png",
        score: 4.5,
        date: "2025-4",
        status: "已看",
    },

    // 11
    {
        title: "跟踪",
        poster: "https://img.haipeng-lin.cn/20251207183746.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "扎职3",
        poster: "https://img.haipeng-lin.cn/20251207183820.png",
        score: 4,
        date: "2025-4",
        status: "已看",
    },
    {
        title: "扎职2·江湖陌路",
        poster: "https://img.haipeng-lin.cn/20251207183834.png",
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "扎职",
        poster: "https://img.haipeng-lin.cn/20251207183847.png",
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "魔警",
        poster: "https://img.haipeng-lin.cn/20251207183900.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "毒战",
        poster: "https://img.haipeng-lin.cn/20251207183913.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },

    // 1
    {
        title: "龙在江湖",
        poster: "https://img.haipeng-lin.cn/20251207202033.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "龙在边缘",
        poster: "https://img.haipeng-lin.cn/20251207202049.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "证人",
        poster: "https://img.haipeng-lin.cn/20251207202104.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "杀破狼2",
        poster: "https://img.haipeng-lin.cn/20251207202116.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "杀破狼",
        poster: "https://img.haipeng-lin.cn/20251207202130.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "线人",
        poster: "https://img.haipeng-lin.cn/20251207202145.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },

    {
        title: "赌神",
        poster: "https://img.haipeng-lin.cn/20251207202403.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "赌神2",
        poster: "https://img.haipeng-lin.cn/20251207202435.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "赌神3·少年赌神",
        poster: "https://img.haipeng-lin.cn/20251207202710.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "澳门风云",
        poster: "https://img.haipeng-lin.cn/20251207202456.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "澳门风云2",
        poster: "https://img.haipeng-lin.cn/20251207202506.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "孤男寡女",
        poster: "https://img.haipeng-lin.cn/20251207202522.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },

    // 1
    {
        title: "盲探",
        poster: "https://img.haipeng-lin.cn/20251207202539.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "龙凤斗",
        poster: "https://img.haipeng-lin.cn/20251207202553.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "无间道",
        poster: "https://img.haipeng-lin.cn/20251207202606.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "无间道2",
        poster: "https://img.haipeng-lin.cn/20251207202619.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "无间道3·终极无间",
        poster: "https://img.haipeng-lin.cn/20251207202632.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "哪吒",
        poster: "https://img.haipeng-lin.cn/20251207202645.png",
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "封神2",
        poster: 'https://img.haipeng-lin.cn/1777261788117.png',
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "胜券在握",
        poster: 'https://img.haipeng-lin.cn/1777261743549.png',
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "孤注一掷",
        poster: 'https://img.haipeng-lin.cn/1777261709692.png',
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "动物世界",
        poster: 'https://img.haipeng-lin.cn/1777261664968.png',
        score: 4,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "周处除三害",
        poster: 'https://img.haipeng-lin.cn/1777261631722.png',
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: "跛豪",
        poster: 'https://img.haipeng-lin.cn/1777261549280.png',
        score: 5,
        date: "2025-3",
        status: "已看",
    },
    {
        title: 'B+侦探',
        poster: 'https://img.haipeng-lin.cn/1777261512928.png',
        score: 4,
        date: '2025-1',
        status: '已看'
    },
    {
        title: 'C+侦探',
        poster: 'https://img.haipeng-lin.cn/1777261443926.png',
        score: 4.5,
        date: '2025-1',
        status: '已看'
    },
    {
        title: '同谋',
        poster: 'https://img.haipeng-lin.cn/1777261218559.png',
        score: 5,
        date: '2025-1',
        status: '已看'
    },
    {
        title: '龙虎风云',
        poster: 'https://img.haipeng-lin.cn/1777261252738.png',
        score: 5,
        date: '2025-1',
        status: '已看'
    },
    {
        title: '扫毒',
        poster: 'https://img.haipeng-lin.cn/1777261165271.png',
        score: 5,
        date: '2025-1',
        status: '已看'
    },
    {
        title: '追龙2',
        poster: 'https://img.haipeng-lin.cn/1777261081178.png',
        score: 4,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '追龙',
        poster: 'https://img.haipeng-lin.cn/1777261041111.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '无双',
        poster: 'https://img.haipeng-lin.cn/1777261005384.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '树大招风',
        poster: 'https://img.haipeng-lin.cn/1777260927628.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '机动部队系列',
        poster: 'https://img.haipeng-lin.cn/1777260874398.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '神探',
        poster: 'https://img.haipeng-lin.cn/1777260833650.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '神探大战',
        poster: 'https://img.haipeng-lin.cn/1777260794350.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },

    {
        title: '寒战',
        poster: 'https://img.haipeng-lin.cn/1777260744842.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '寒战2',
        poster: 'https://img.haipeng-lin.cn/1777260086969.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '窃听风云',
        poster: 'https://img.haipeng-lin.cn/1777259243904.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '窃听风云2',
        poster: 'https://img.haipeng-lin.cn/1777259774889.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },
    {
        title: '门徒',
        poster: 'https://img.haipeng-lin.cn/1777259142105.png',
        score: 5,
        date: '2024-12',
        status: '已看'
    },

    // {
    //   title: '五亿探长·雷洛传',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
    // {
    //   title: '五亿探长·雷洛传2',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
    // {
    //   title: '毒舌大状',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
    // {
    //   title: '旺角卡门',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
    // {
    //   title: '黑社会',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
    // {
    //   title: '黑社会2·以和为贵',
    //   poster: '',
    //   score: 5,
    //   date: '2024-12',
    //   status: '已看'
    // },
]);

const tvList = ref([
    {
        title: "三国演义（1994）",
        poster: "https://img.haipeng-lin.cn/1777259029426.png",
        score: 5,
        date: "2026-4-2",
        status: "在看",
    },
    {
        title: "三国演义（2010）",
        poster: "https://img.haipeng-lin.cn/1777258984460.png",
        score: 5,
        date: "2026-3-4",
        status: "已看",
    },
    {
        title: "雍正王朝",
        poster: "https://img.haipeng-lin.cn/20251009232932.png",
        score: 5,
        date: "2025-12-1",
        status: "三刷",
    },
    {
        title: "射雕英雄传（83版）",
        poster: "https://img.haipeng-lin.cn/1777258844015.png",
        score: 5,
        date: "2025-11-8",
        status: "已看",
    },
    {
        title: "神雕侠侣",
        poster: "https://img.haipeng-lin.cn/1777258894138.png",
        score: 5,
        date: "2025-10-15",
        status: "已看",
    },
]);

// --- 2. 工具函数 (保持不变) ---
const getStars = (score) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalf = score % 1 !== 0;
    for (let i = 0; i < fullStars; i++) stars.push("full");
    if (hasHalf) stars.push("half");
    while (stars.length < 5) stars.push("empty");
    return stars;
};
</script>

<style scoped>
/* --- 变量定义 --- */
.movie-collection-container {
    --card-bg: #ffffff;
    --text-overlay: #fff;
    /* 遮罩层文字颜色 */
    --text-overlay-sub: rgba(255, 255, 255, 0.7);
    /* 遮罩层次要文字颜色 */
    --primary: #49b1f5;
    --star-color: #ffc107;
    --shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.2);
    min-height: 100vh;
}

.header {
    margin: 0 auto 10px;
    text-align: center;
}

.header h2 {
    margin: 0 0 10px;
    color: #4c4948;
}

.subtitle {
    color: #999;
    font-size: 0.9rem;
}

/* --- 网格布局 (核心修改) --- */
.movie-grid {
    display: grid;
    /* 核心需求：一行显示6个。使用 minmax 确保最小宽度，避免过分挤压 */
    grid-template-columns: repeat(6, 1fr);
    gap: 20px;
    /* 卡片间距 */
    max-width: 1400px;
    /* 增加最大宽度以容纳6列 */
    margin: 0 auto;
}

/* --- 卡片项样式 --- */
.movie-grid-item {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: var(--shadow);
    transition: all 0.3s ease;
    background: var(--card-bg);
    /* 强制设置宽高比为常见的海报比例 (2:3) */
    aspect-ratio: 2 / 3;
    /* 解决 Safari 圆角溢出问题 */
    transform: translateZ(0);
}

.movie-grid-item:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
}

/* 海报包裹层 */
.poster-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    cursor: pointer;
}

.poster-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 确保图片填满且不变形 */
    transition: transform 0.5s ease;
}

.movie-grid-item:hover .poster-wrapper img {
    transform: scale(1.05);
    /* 轻微放大效果 */
}

/* --- 右上角状态 --- */
.status-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    /* 改为右上角 */
    background: rgba(0, 0, 0, 0.65);
    color: var(--text-overlay);
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 4px;
    backdrop-filter: blur(4px);
    z-index: 2;
    font-weight: 500;
}

/* --- 左下角信息遮罩层 --- */
.movie-overlay-info {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 50px 12px 12px;
    /* 顶部留出空间给渐变 */
    box-sizing: border-box;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    /* 关键：底部黑色渐变，保证文字清晰度 */
    background: linear-gradient(to top,
            rgba(0, 0, 0, 0.85) 0%,
            rgba(0, 0, 0, 0.5) 60%,
            transparent 100%);
    color: var(--text-overlay);
}

/* 电影标题 */
.movie-title {
    margin: 0 0 6px 0;
    font-size: 1rem;
    font-weight: bold;
    line-height: 1.3;
    color: #ffffff;
}

/* 评分行 */
.meta-row {
    display: flex;
    align-items: center;
    margin-bottom: 6px;
}

.rating-stars {
    display: flex;
    align-items: center;
}

/* 星星图标调整得更紧凑小巧 */
.star-icon {
    font-size: 12px;
    margin-right: 1px;
}

.star-icon.full {
    color: var(--star-color);
}

.star-icon.half {
    color: transparent;
    background: linear-gradient(90deg,
            var(--star-color) 50%,
            rgba(255, 255, 255, 0.3) 50%);
    background-clip: text;
    -webkit-background-clip: text;
}

.star-icon.empty {
    color: rgba(255, 255, 255, 0.3);
}

.score-num {
    margin-left: 6px;
    color: var(--star-color);
    font-weight: bold;
    font-size: 0.9rem;
}

/* 观看时间 */
.watch-date {
    font-size: 0.75rem;
    color: var(--text-overlay-sub);
}

/* --- 响应式适配 (重要) --- */
/* 确保在小屏幕上不会强制6列导致不可看 */
@media (max-width: 1200px) {
    .movie-grid {
        grid-template-columns: repeat(5, 1fr);
    }
}

@media (max-width: 992px) {
    .movie-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (max-width: 768px) {
    .movie-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .movie-collection-container {
        padding: 20px 10px;
    }

    .movie-grid {
        gap: 10px;
    }
}

@media (max-width: 480px) {
    .movie-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .movie-title {
        font-size: 0.9rem;
    }
}
</style>