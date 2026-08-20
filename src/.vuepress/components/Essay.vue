<script setup>
import { ref, onMounted } from 'vue';

// 数据
const essays = ref([]);

// 从 JSON 文件加载数据
onMounted(async () => {
    try {
        const response = await fetch('/assets/data/essays.json');
        essays.value = await response.json();
    } catch (error) {
        console.error('加载短文数据失败:', error);
    }
});
</script>

<template>
  <div class="essay-container">
    <div class="essay-masonry">
      <div v-for="essay in essays" :key="essay.id" class="essay-card">
        <!-- 文字区域 -->
        <p class="essay-text">{{ essay.text }}</p>

        <!-- 图片区域 -->
        <div
          class="essay-images"
          :class="{ 'single-image': essay.images.length === 1 }"
        >
          <img
            v-for="(img, index) in essay.images"
            :key="index"
            :src="img"
            :alt="`图片${index + 1}`"
            loading="lazy"
            class="essay-image"
            :class="{ single: essay.images.length === 1 }"
          />
        </div>

        <!-- 时间地点区域 -->
        <div class="essay-meta">
          <span class="essay-date">
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            {{ essay.date }}
          </span>
          <span class="essay-location">
            <svg
              class="icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {{ essay.location }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.essay-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

/* 瀑布流布局 */
.essay-masonry {
  column-count: 3;
  column-gap: 20px;
}

@media (max-width: 1200px) {
  .essay-masonry {
    column-count: 2;
  }
}

@media (max-width: 768px) {
  .essay-masonry {
    column-count: 1;
  }
}

/* 卡片样式 */
.essay-card {
  break-inside: avoid;
  margin-bottom: 20px;
  padding: 16px;
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.essay-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  cursor: pointer;
}

/* 文字区域 */
.essay-text {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

/* 图片区域 */
.essay-images {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
  border-radius: 8px;
}

.essay-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.single-image {
  justify-content: center;
}

.essay-image.single {
  width: 400px;
  height: 180px;
}

.essay-image.single.portrait {
  width: 180px;
  height: 400px;
}

.essay-card:hover .essay-image {
  transform: scale(1.02);
}

/* 时间地点区域 */
.essay-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px dashed var(--vp-c-divider);
}

.essay-date,
.essay-location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
}

.icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}
</style>
