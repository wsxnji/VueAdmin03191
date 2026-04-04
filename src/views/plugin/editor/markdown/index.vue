<script setup lang="ts">
import { onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import type Vditor from 'vditor';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({ name: 'MarkdownPage' });

const theme = useThemeStore();

const vditor = shallowRef<Vditor>();
const domRef = ref<HTMLElement>();

async function renderVditor() {
  if (!domRef.value) return;

  const [{ default: VditorClass }] = await Promise.all([import('vditor'), import('vditor/dist/index.css')]);

  vditor.value = new VditorClass(domRef.value, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false }
  });
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
