<template>
  <el-dialog
    :model-value="modelValue"
    :width="width"
    append-to-body
    class="ui-frame-dialog"
    modal-class="ui-frame-dialog-modal"
    :show-close="false"
    :close-on-click-modal="true"
    :close-on-press-escape="true"
    :style="{ '--ui-frame-offset-top': offsetTop }"
    @update:model-value="onVisible"
  >
    <div class="ui-frame-dialog__panel" :style="{ backgroundImage: `url(${resolvedFrame})` }">
      <button
        type="button"
        class="ui-frame-dialog__close"
        aria-label="关闭"
        @click="onVisible(false)"
      >
        <img :src="resolvedClose" alt="" />
      </button>

      <div class="ui-frame-dialog__body">
        <slot />
      </div>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { FrameDialogProps } from './types'
import defaultFrame from '../../assets/src/icons/vBack_dialog.svg'
import defaultClose from '../../assets/src/icons/vBack_dialog_close.svg'

const props = withDefaults(
  defineProps<
    FrameDialogProps & {
      modelValue: boolean
    }
  >(),
  {
    width: '640px',
    offsetTop: '96px'
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const resolvedFrame = computed(() => props.frameSrc || defaultFrame)
const resolvedClose = computed(() => props.closeSrc || defaultClose)

function onVisible(v: boolean) {
  emit('update:modelValue', v)
}
</script>

<!-- append-to-body：样式必须非 scoped -->
<style lang="scss">
.ui-frame-dialog-modal {
  background: rgba(0, 12, 28, 0.55) !important;
}

.ui-frame-dialog.el-dialog {
  --el-dialog-bg-color: transparent;
  --el-dialog-padding-primary: 0;
  margin: var(--ui-frame-offset-top, 96px) auto 40px !important;
  padding: 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0 !important;
    background: transparent;
  }
}

/*
 * SVG 素材横版 491×317。
 * 面板同比例 + 背景铺满，内容落在安全区内。
 */
.ui-frame-dialog__panel {
  --ui-frame-accent: #9dfffe;
  --ui-frame-text: #e5eaf0;

  position: relative;
  box-sizing: border-box;
  width: 100%;
  aspect-ratio: 491 / 317;
  height: auto;
  margin: 0 auto;
  overflow: hidden;
  color: var(--ui-frame-text);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.ui-frame-dialog__close {
  position: absolute;
  top: 14px;
  right: 16px;
  z-index: 3;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }

  &:hover {
    opacity: 0.85;
  }
}

.ui-frame-dialog__body {
  position: absolute;
  z-index: 1;
  top: 36px;
  right: 36px;
  bottom: 36px;
  left: 36px;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
