import { sizingStyleApi } from '@my-repo/apis'
import { CapStyleViewModel, mapSizingStyleProbToView, SizingStyleMode } from '@my-repo/business'
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
  const loading = ref(false)

  /**调 sizingStyleApi.getSizingStyleProb()，再用 mapSizingStyleProbToView 转成 CapStyleViewModel，赋给 data。
   *    只负责「拉实时概率 + 适配」，给 mode 0 的双环用。不直接给页面调，由 refresh 统一调用。
   */
  async function refreshProb() {
    const raw = await sizingStyleApi.getSizingStyleProb()
    data.value = mapSizingStyleProbToView(raw)
  }

  async function refresh() {
    loading.value = true
    try {
      if (mode.value === 0) {
        await refreshProb()
      } else {
        await refreshProb()
      }
    } catch (e) {
      console.error('[SizingStyle] refresh failed', e)
      data.value = null
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
    loading,
    setMode,
    toggleMode,
    refresh
  }
}
