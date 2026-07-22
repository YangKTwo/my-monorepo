import { ref, type Ref } from 'vue'
import { vBackApi, type VBackSuccessData, type VBackSuccessRow } from '@my-repo/apis'
import {
  mapAntiVToView,
  mapNewVRightToView,
  mapVBackToView,
  type ProbMode,
  type VReverseProbabilityViewModel
} from '@my-repo/business'

/** 接口超时/失败兜底 —— 从 Index1 原样搬 */
const PAST5_MOCK: VBackSuccessRow[] = [
  { dealDate: '2026-07-20', vPointTime: '10:39', rightPro: 0.6617, leftPro: 0.4997 },
  { dealDate: '2026-07-20', vPointTime: '14:02', rightPro: 0.51, leftPro: 0.1998 },
  { dealDate: '2026-07-20', vPointTime: '14:26', rightPro: 0.3308, leftPro: 0.5607 },
  { dealDate: '2026-07-20', vPointTime: '14:40', rightPro: 0.1813, leftPro: 0.4657 },
  { dealDate: '2026-07-17', vPointTime: '09:50', rightPro: 0.412, leftPro: 0.3694 },
  { dealDate: '2026-07-17', vPointTime: '10:03', rightPro: 0.4999, leftPro: 0.3205 },
  { dealDate: '2026-07-16', vPointTime: '10:00', rightPro: 0.4997, leftPro: 0.4997 },
  { dealDate: '2026-07-15', vPointTime: '10:06', rightPro: 0.4997, leftPro: 0.3301 },
  { dealDate: '2026-07-14', vPointTime: '13:05', rightPro: 0.4997, leftPro: 0.4997 },
  { dealDate: '2026-07-14', vPointTime: '13:22', rightPro: 0.4211, leftPro: 0.3888 },
  { dealDate: '2026-07-14', vPointTime: '14:05', rightPro: 0.3555, leftPro: 0.4122 },
  { dealDate: '2026-07-13', vPointTime: '09:45', rightPro: 0.2801, leftPro: 0.5012 },
  { dealDate: '2026-07-13', vPointTime: '10:18', rightPro: 0.3333, leftPro: 0.4444 },
  { dealDate: '2026-07-13', vPointTime: '13:40', rightPro: 0.5123, leftPro: 0.2987 },
  { dealDate: '2026-07-13', vPointTime: '14:55', rightPro: 0.6001, leftPro: 0.2505 }
]

function logApi(name: string, data: unknown) {
  console.group(`[VBack] ${name}`)
  console.log(data)
  console.groupEnd()
}

export function useVBackProb(dealDate: Ref<string>) {
  const mode = ref<ProbMode>('merge')
  const data = ref<VReverseProbabilityViewModel | null>(null)
  const loading = ref(false)

  const past5Visible = ref(false)
  const past5Rows = ref<VBackSuccessData>([])

  async function loadByMode(nextMode: ProbMode = mode.value) {
    try {
      if (nextMode === 'merge') {
        const [vBackResult, sseResult] = await Promise.allSettled([
          vBackApi.getVBackPredict({ dealDate: dealDate.value }),
          vBackApi.getSseIndexMin({ dealDate: dealDate.value })
        ])

        if (vBackResult.status !== 'fulfilled') {
          throw vBackResult.reason
        }

        const vBack = vBackResult.value
        const sse =
          sseResult.status === 'fulfilled' && Array.isArray(sseResult.value) ? sseResult.value : []

        logApi('VBackPredict', vBack)
        if (sseResult.status === 'fulfilled') logApi('SseIndexMin', sse)
        else console.warn('[VBack] SseIndexMin failed', sseResult.reason)

        data.value = mapVBackToView(vBack, { mode: 'merge', sse })
        return
      }

      if (nextMode === 'curve') {
        const vBack = await vBackApi.getVBackPredict({ dealDate: dealDate.value })
        data.value = mapVBackToView(vBack, { mode: 'curve', sse: [] })
        return
      }

      if (nextMode === 'anti') {
        const raw = await vBackApi.getBackVMonitor({ dealDate: dealDate.value })
        logApi('backVMonitor', raw)
        data.value = mapAntiVToView(raw)
        return
      }

      const raw = await vBackApi.getNewVRight({ dealDate: dealDate.value })
      logApi('getNewVRight', raw)
      data.value = mapNewVRightToView(raw)
    } catch (e) {
      console.error(`[VBack] loadByMode(${nextMode}) failed`, e)
      data.value = null
    }
  }

  async function refresh() {
    loading.value = true
    try {
      await loadByMode(mode.value)
    } finally {
      loading.value = false
    }
  }

  async function setMode(next: ProbMode) {
    mode.value = next
    await loadByMode(next)
  }

  async function openPast5() {
    past5Visible.value = true
    try {
      const rows = await vBackApi.getVBackSuccessData({ dealDate: dealDate.value })
      logApi('VBackSuccessData', rows)
      past5Rows.value = Array.isArray(rows) && rows.length ? rows : PAST5_MOCK
    } catch (e) {
      console.error('[VBack] past5 failed, use mock', e)
      past5Rows.value = PAST5_MOCK
    }
  }

  return {
    data,
    mode,
    loading,
    past5Visible,
    past5Rows,
    setMode,
    openPast5,
    refresh
  }
}
