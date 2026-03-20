<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue';

const props = defineProps<{
  loader: () => Promise<any>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  loaded: [instance: any];
}>();

const isLoading = ref(true);
const isError = ref(false);
const errorMessage = ref('');
const LazyComponent = shallowRef<any>(null);

async function loadComponent() {
  isLoading.value = true;
  isError.value = false;
  
  try {
    const component = await props.loader();
    LazyComponent.value = component.default || component;
    emit('loaded', component);
  } catch (error: any) {
    isError.value = true;
    errorMessage.value = error.message || '组件加载失败';
    console.error('Failed to load component:', error);
  } finally {
    isLoading.value = false;
  }
}

watch(
  () => props.loader,
  () => {
    loadComponent();
  },
  { immediate: true }
);

defineExpose({
  reload: loadComponent
});
</script>

<template>
  <div class="lazy-loader">
    <div v-if="isLoading || loading" class="lazy-loading">
      <ElIcon class="loading-icon"><IconEpLoading /></ElIcon>
      <p class="loading-text">加载中...</p>
    </div>
    
    <div v-else-if="isError" class="lazy-error">
      <ElIcon class="error-icon"><IconEpWarning /></ElIcon>
      <p class="error-text">{{ errorMessage }}</p>
      <ElButton type="primary" size="small" @click="loadComponent">重新加载</ElButton>
    </div>
    
    <component v-else :is="LazyComponent" v-bind="$attrs" v-on="$listeners" />
  </div>
</template>

<style lang="scss" scoped>
.lazy-loader {
  width: 100%;
  min-height: 100px;
  position: relative;
}

.lazy-loading,
.lazy-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--el-text-color-secondary);
}

.loading-icon,
.error-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.loading-icon {
  animation: rotating 1.5s linear infinite;
}

.error-icon {
  color: var(--el-color-warning);
}

.loading-text,
.error-text {
  margin: 0 0 12px 0;
  font-size: 14px;
}

@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
