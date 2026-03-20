<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';
import type WangEditor from 'wangeditor';

defineOptions({ name: 'QuillPage' });

const editor = shallowRef<WangEditor>();
const domRef = ref<HTMLElement>();

async function renderWangEditor() {
  const { default: WangEditorClass } = await import('wangeditor');
  editor.value = new WangEditorClass(domRef.value);
  setEditorConfig();
  editor.value.create();
}

function setEditorConfig() {
  if (editor.value?.config?.zIndex) {
    editor.value.config.zIndex = 10;
  }
}

onMounted(() => {
  renderWangEditor();
});
</script>

<template>
  <div class="h-full">
    <ElCard header="富文本插件" class="card-wrapper">
      <div ref="domRef" class="bg-white dark:bg-dark"></div>
      <template #footer>
        <GithubLink link="https://github.com/wangeditor-team/wangEditor" />
      </template>
    </ElCard>
  </div>
</template>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: var(--el-border-color) !important;
}
:deep(.w-e-text-container) {
  background: inherit;
  border-color: var(--el-border-color) !important;
}
</style>
