/** 本地检测：用 mocks；真接口有数据后改回 sizingStyleApi */
import { sizingStyleMockApi } from '@my-repo/apis'
import {
  CapCurveBarViewModel,
  CapPhaseViewModel,
  CapStyleViewModel,
  mapSizingStyleListToCurveBar,
  mapSizingStyleListToPhase,
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

function today() {
  const d = new Date()
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export function useSizingStyle() {
  const mode = ref<SizingStyleMode>(readMode())
  const data = ref<CapStyleViewModel | null>(null)
  const phaseData = ref<CapPhaseViewModel | null>(null)
  const curveBarData = ref<CapCurveBarViewModel | null>(null)
  const loading = ref(false)

  /** mode0：双环概率 */
  async function refreshProb() {
    const raw = await sizingStyleMockApi.getSizingStyleProb()
    data.value = mapSizingStyleProbToView(raw)
  }

  /**mode1 mode2 */
  async function refreshList() {
    const day = today()
    const list = await sizingStyleMockApi.getSizingStyleList({
      startDate: day,
      endDate: day
    })
    if (mode.value === 1) {
      phaseData.value = mapSizingStyleListToPhase(list)
      curveBarData.value = null
    } else if (mode.value === 2) {
      curveBarData.value = mapSizingStyleListToCurveBar(list)
      phaseData.value = null
    }
  }

  async function refresh() {
    loading.value = true
    try {
      if (mode.value === 0) await refreshProb()
      else await refreshList()
    } catch (e) {
      console.error('[SizingStyle] refresh failed', e)
      data.value = null
      phaseData.value = null
      curveBarData.value = null
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
    curveBarData,
    loading,
    setMode,
    toggleMode,
    refresh
  }
}
