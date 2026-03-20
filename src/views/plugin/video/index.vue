<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';

defineOptions({ name: 'VideoComp' });

const domRef = ref<HTMLElement>();
const player = shallowRef<any>();
const isLoading = ref(false);

async function renderXgPlayer() {
  if (!domRef.value || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // 动态导入 xgplayer
    await import('xgplayer/dist/index.min.css');
    const { default: Player } = await import('xgplayer');
    
    const url = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4';
    player.value = new Player({
      el: domRef.value,
      url,
      playbackRate: [0.5, 0.75, 1, 1.5, 2]
    });
  } catch (error) {
    console.error('Failed to load xgplayer:', error);
  } finally {
    isLoading.value = false;
  }
}

function destroyXgPlayer() {
  player.value?.destroy();
  player.value = null;
}

onMounted(() => {
  renderXgPlayer();
});

onUnmounted(() => {
  destroyXgPlayer();
});
</script>

<template>
  <div>
    <ElCard header="视频播放器插件" class="h-full card-wrapper">
      <div class="flex-center">
        <div ref="domRef" class="h-auto w-full shadow-md"></div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped></style>
