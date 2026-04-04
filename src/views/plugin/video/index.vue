<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef } from 'vue';
import type Player from 'xgplayer';

defineOptions({ name: 'VideoComp' });

const domRef = ref<HTMLElement>();
const player = shallowRef<Player>();

async function renderXgPlayer() {
  if (!domRef.value) return;

  const [{ default: XgPlayer }] = await Promise.all([import('xgplayer'), import('xgplayer/dist/index.min.css')]);

  const url = 'https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/xgplayer-demo.mp4';
  player.value = new XgPlayer({
    el: domRef.value,
    url,
    playbackRate: [0.5, 0.75, 1, 1.5, 2]
  });
}
function destroyXgPlayer() {
  player.value?.destroy();
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
