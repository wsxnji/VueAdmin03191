<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'MarkdownPage' });

const vditor = ref<Vditor>();


function renderVditor() {
  if (!domRef.value) return;
  vditor.value = new Vditor(domRef.value, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false }
  });
});

onUnmounted(() => {
  stopHandle();
});
</script>

<template>
  <div class="h-full">
    <ElCard header="markdown插件" class="card-wrapper">
      <div ref="domRef"></div>
      <template #footer>
        <GithubLink link="https://github.com/Vanessa219/vditor" />
      </template>
    </ElCard>
  </div>
