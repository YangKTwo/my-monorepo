/** 本地检测：用 mocks；真接口有数据后改回 sizingStyleApi */
import { sizingStyleMockApi } from '@my-repo/apis'
import {
  CapPhaseViewModel,
  CapStyleViewModel,
  mapSizingStyleProbToView,
  SizingStyleMode
} from '@my-repo/business'
import { ref } from 'vue'

const MODE_KEY = 'sizing-style-mode'

/**从 localStorage（key：sizing-style-mode）读上次选的形态。 刷新页面后还能回到用户上次选的形态。*/
function readMode(): SizingStyleMode {
  const v = Number(localStorage.getItem(MODE_KEY) ?? 0)
  return v === 1 || v === 2 ? v : 0
}

export function useSizingStyle() {
  const mode = ref<SizingStyleMode>(readMode())
  const data = ref<CapStyleViewModel | null>(null)
  const phaseData = ref<CapPhaseViewModel | null>(null)
  const loading = ref(false)

  /** mode0：双环概率 */
  async function refreshProb() {
    const raw = await sizingStyleMockApi.getSizingStyleProb()
    data.value = mapSizingStyleProbToView(raw)
  }

  /** mode1：二维相空间路径 */
  async function refreshPhase() {
    const raw = await sizingStyleMockApi.getSizingStylePhasePath()
    phaseData.value = raw
  }

  async function refresh() {
    loading.value = true
    try {
      if (mode.value === 0) {
        await refreshProb()
      } else if (mode.value === 1) {
        await refreshPhase()
      } else {
        // mode2 暂未实现
        phaseData.value = null
      }
    } catch (e) {
      console.error('[SizingStyle] refresh failed', e)
      if (mode.value === 0) data.value = null
      else phaseData.value = null
    } finally {
      loading.value = false
    }
  }

  function setMode(next: SizingStyleMode) {
    mode.value = next
    localStorage.setItem(MODE_KEY, String(next))
    void refresh()
  }

  /** 0 → 1 → 2 → 0，给「切换形态」按钮 */
  function toggleMode() {
    setMode(((mode.value + 1) % 3) as SizingStyleMode)
  }

  return {
    mode,
    data,
    phaseData,
    loading,
    setMode,
    toggleMode,
    refresh
  }
}
