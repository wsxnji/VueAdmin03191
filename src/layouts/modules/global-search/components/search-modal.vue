<script lang="ts" setup>
import { computed, ref, shallowRef, watch } from 'vue';
import { useRouter } from 'vue-router';
import { onKeyStroke } from '@vueuse/core';
import type { InputInstance } from 'element-plus';
import { useRouteStore } from '@/store/modules/route';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import { useDebounce, useDebounceFn } from '@sa/hooks';
import SearchResult from './search-result.vue';
import SearchFooter from './search-footer.vue';

defineOptions({ name: 'SearchModal' });

const router = useRouter();
const appStore = useAppStore();
const routeStore = useRouteStore();

const isMobile = computed(() => appStore.isMobile);

const keyword = ref('');
const activePath = ref('');
const resultOptions = shallowRef<App.Global.Menu[]>([]);

// 使用自定义防抖hook优化搜索
const debouncedKeyword = useDebounce(keyword, { wait: 300 });

function search(searchKeyword: string) {
  const trimKeyword = searchKeyword.toLocaleLowerCase().trim();

  if (!trimKeyword) {
    resultOptions.value = [];
    activePath.value = '';
    return;
  }

  resultOptions.value = routeStore.searchMenus.filter(menu => {
    const title = (menu.i18nKey ? $t(menu.i18nKey) : menu.label).toLocaleLowerCase();
    return title.includes(trimKeyword);
  });

  activePath.value = resultOptions.value[0]?.routePath ?? '';
}

// 监听防抖后的关键词变化
watch(debouncedKeyword, (newKeyword) => {
  search(newKeyword);
}, { immediate: true });

// 提供一个防抖函数用于直接调用
const { run: handleSearch } = useDebounceFn((val: string) => search(val), 300);

const visible = defineModel<boolean>('show', { required: true });

const searchInput = ref<InputInstance>();

function handleClose() {
  // handle with setTimeout to prevent user from seeing some operations
  setTimeout(() => {
    visible.value = false;
    resultOptions.value = [];
    keyword.value = '';
  }, 200);
}

/** key up */
function handleUp() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === 0 ? length - 1 : index - 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

/** key down */
function handleDown() {
  const { length } = resultOptions.value;
  if (length === 0) return;

  const index = getActivePathIndex();
  if (index === -1) return;

  const activeIndex = index === length - 1 ? 0 : index + 1;

  activePath.value = resultOptions.value[activeIndex].routePath;
}

function getActivePathIndex() {
  return resultOptions.value.findIndex(item => item.routePath === activePath.value);
}

/** key enter */
function handleEnter() {
  if (resultOptions.value?.length === 0 || activePath.value === '') return;
  handleClose();
  router.push(activePath.value);
}

function registerShortcut() {
  onKeyStroke('Escape', handleClose);
  onKeyStroke('Enter', handleEnter);
  onKeyStroke('ArrowUp', handleUp);
  onKeyStroke('ArrowDown', handleDown);
}

/** open dialog and set input focus */
function setFocus() {
  setTimeout(() => {
    searchInput.value?.focus();
  });
}

registerShortcut();
</script>

<template>
  <ElDialog
    v-model="visible"
    :show-close="false"
    append-to-body
    class="search-modal fixed left-0 right-0"
    :class="[isMobile ? 'size-full top-0px rounded-0' : 'w-630px top-50px']"
    @open-auto-focus="setFocus"
    @close="handleClose"
  >
    <ElInput
      ref="searchInput"
      v-model="keyword"
      clearable
      :placeholder="$t('common.keywordSearch')"
      @input="handleSearch"
    >
      <template #prefix>
        <icon-uil-search class="text-15px" />
      </template>
      <template v-if="isMobile" #append>
        <ElButton type="primary" plain @click="handleClose">{{ $t('common.cancel') }}</ElButton>
      </template>
    </ElInput>

    <div>
      <ElEmpty v-if="resultOptions.length === 0" :description="$t('common.noData')" :image-size="50" />
      <SearchResult v-else v-model:path="activePath" :options="resultOptions" @enter="handleEnter" />
    </div>
    <template #footer>
      <SearchFooter v-if="!isMobile" />
    </template>
  </ElDialog>
</template>

<style lang="scss">
.search-modal {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 10px 15px 0;
  }
  .el-dialog__footer {
    border-top-width: 1px;
  }
}
</style>
