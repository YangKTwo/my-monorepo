import { PredictItem } from '../../../../apis/src/modules/forecast/type'
import type { ForecastPredict, ForecastQuartilesVo, MarketLevelViewModel } from './types'

const META: Record<
  ForecastPredict,
  Pick<MarketLevelViewModel, 'level' | 'label' | 'gaugeValue'>
> = {
  // 四段：-100~-50 空 / -50~0 震荡空 / 0~50 震荡多 / 50~100 多
  [-2]: { level: '空', label: '空', gaugeValue: -80 },
  [-1]: { level: '震荡空', label: '空', gaugeValue: -40 },
  [2]: { level: '震荡多', label: '多', gaugeValue: 40 },
  [1]: { level: '多', label: '多', gaugeValue: 80 }
}

export function mapForecastToGauge(
  vo: ForecastQuartilesVo,
  subtitle = '开盘预估'
): MarketLevelViewModel {
  const predict = vo.predict as ForecastPredict
  const meta = META[predict] ?? META[1]
  return {
    predict,
    ...meta,
    subtitle
    // probabilityText: '70%' // 接口无此字段，先不显示
  }
}

export function pickLatestForecast(list: ForecastQuartilesVo[]) {
  if (!list?.length) return null
  return [...list].sort((a, b) => +new Date(b.dealTime) - +new Date(a.dealTime))[0]
}

export function mapLongShortToGauge(
  item: PredictItem,
  subtitle = '多空预估'
): MarketLevelViewModel {
  const pct = item.predict * 100
  const signed = item.pupil === '空' ? -pct : pct

  return {
    predict: (item.pupil === '空' ? -2 : 1) as ForecastPredict,
    level: item.pupil === '空' ? '空' : '多',
    label: item.pupil === '空' ? '空' : '多',
    gaugeValue: Math.max(-100, Math.min(100, signed)),
    subtitle,
    probabilityText: `${Math.round(pct)}%`
  }
}

export function pickLatestPredict(list: PredictItem[]) {
  if (!list?.length) return null
  return [...list].sort((a, b) => b.dealDate - a.dealDate)[0]
}
