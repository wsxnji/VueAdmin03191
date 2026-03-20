import type { App } from 'vue';
import { ElCard, ElForm, ElTable } from 'element-plus';

/** global table column align */
ElTable.TableColumn.props.align = {
  type: String,
  default: 'center'
};

/** global ElCard shadow */
ElCard.props.shadow = {
  type: String,
  default: 'never'
};

/** global ElForm require asterisk position */
ElForm.props.requireAsteriskPosition = {
  type: String,
  default: 'right'
};

/**
 * Element Plus 按需引入配置
 * 组件通过 unplugin-vue-components 自动导入
 * 这里只做全局配置，不做全量引入
 */
export const setupUI = (_app: App) => {
  // Element Plus 组件已通过 unplugin-vue-components 自动导入
  // 无需全量引入，减少首屏加载体积
};
