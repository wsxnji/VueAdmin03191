<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch, shallowRef } from 'vue';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'MarkdownPage' });

const theme = useThemeStore();

const vditor = shallowRef<any>();
const domRef = ref<HTMLElement>();
const isLoading = ref(false);

async function renderVditor() {
  if (!domRef.value || isLoading.value) return;
  
  isLoading.value = true;
  
  try {
    // 动态导入 Vditor
    await import('vditor/dist/index.css');
    const { default: Vditor } = await import('vditor');
    
    vditor.value = new Vditor(domRef.value, {
      minHeight: 400,
      theme: theme.darkMode ? 'dark' : 'classic',
      icon: 'material',
      cache: { enable: false }
    });
  } catch (error) {
    console.error('Failed to load Vditor:', error);
  } finally {
    isLoading.value = false;
  }
}

const stopHandle = watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

onMounted(() => {
  renderVditor();
});

onUnmounted(() => {
  stopHandle();
  if (vditor.value) {
    vditor.value.destroy();
    vditor.value = null;
  }
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
</template>

<style scoped></style>
