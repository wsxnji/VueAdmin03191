<script setup lang="ts">
import { ref, shallowRef, defineAsyncComponent, onMounted } from 'vue';
import type { SwiperOptions } from 'swiper/types';

defineOptions({ name: 'SwiperComp' });

// 使用 defineAsyncComponent 异步加载 Swiper 组件
const Swiper = defineAsyncComponent(() => 
  Promise.all([
    import('swiper/css'),
    import('swiper/css/navigation'),
    import('swiper/css/pagination'),
    import('swiper/vue')
  ]).then(([,,, swiperVue]) => {
    // 配置 Swiper 模块
    return import('swiper').then(({ default: SwiperCore, Navigation, Pagination }) => {
      SwiperCore.use([Navigation, Pagination]);
      return swiperVue.Swiper;
    });
  })
);

const SwiperSlide = defineAsyncComponent(() => 
  import('swiper/vue').then(m => m.SwiperSlide)
);

type SwiperExampleOptions = Pick<
  SwiperOptions,
  'navigation' | 'pagination' | 'scrollbar' | 'slidesPerView' | 'slidesPerGroup' | 'spaceBetween' | 'direction' | 'loop'
>;

interface SwiperExample {
  id: number;
  label: string;
  options: Partial<SwiperExampleOptions>;
}

const isLoaded = ref(false);

const swiperExample: SwiperExample[] = [
  { id: 0, label: 'Default', options: {} },
  { id: 1, label: 'Navigation', options: { navigation: true } },
  { id: 2, label: 'Pagination', options: { pagination: true } },
  { id: 3, label: 'Pagination dynamic', options: { pagination: { dynamicBullets: true } } },
  { id: 4, label: 'Pagination progress', options: { navigation: true, pagination: { type: 'progressbar' } } },
  { id: 5, label: 'Pagination fraction', options: { navigation: true, pagination: { type: 'fraction' } } },
  { id: 6, label: 'Slides per view', options: { pagination: { clickable: true }, slidesPerView: 3, spaceBetween: 30 } },
  { id: 7, label: 'Infinite loop', options: { navigation: true, pagination: { clickable: true }, loop: true } }
];

onMounted(() => {
  // 预加载swiper资源
  import('swiper').then(({ default: SwiperCore, Navigation, Pagination }) => {
    SwiperCore.use([Navigation, Pagination]);
    isLoaded.value = true;
  });
});
</script>

<template>
  <div>
    <ElCard header="Swiper插件" class="card-wrapper">
      <ElSpace :vertical="true">
        <GithubLink link="https://github.com/nolimits4web/swiper" />
        <WebSiteLink label="vue3版文档地址：" link="https://swiperjs.com/vue" />
        <WebSiteLink label="插件demo地址：" link="https://swiperjs.com/demos" />
      </ElSpace>
      <ElSpace class="w-full" direction="vertical">
        <div v-for="item in swiperExample" :key="item.id" class="w-full">
          <h3 class="py-24px text-24px font-bold">{{ item.label }}</h3>
          <Swiper v-bind="item.options">
            <SwiperSlide v-for="i in 5" :key="i">
              <div class="h-240px w-full flex-center border-1px border-#999 text-18px font-bold">Slide{{ i }}</div>
            </SwiperSlide>
          </Swiper>
        </div>
      </ElSpace>
    </ElCard>
  </div>
</template>

<style scoped>
:deep(.el-space__item) {
  width: 100%;
}
</style>
