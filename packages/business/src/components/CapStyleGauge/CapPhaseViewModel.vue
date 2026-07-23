<template>
  <div ref="rootRef" class="cap-phase-path">
    <div class="cap-phase-path__legend">
      <span class="leg"><i class="dot is-tick" />时间点</span>
      <span class="leg"><i class="dot is-open" />开收</span>
    </div>
    <div ref="hostRef" class="cap-phase-path__host" />
  </div>
</template>

<script setup lang="ts">
import * as d3 from 'd3'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { CapPhaseViewModel } from './types'

const props = defineProps<{
  data: CapPhaseViewModel
}>()

const rootRef = ref<HTMLElement>()
const hostRef = ref<HTMLElement>()
let resizeObserver: ResizeObserver | null = null
let lastW = 0
let lastH = 0
let rafId = 0

function colorAt(t: number) {
  return d3
    .scaleLinear<string>()
    .domain([0, 0.35, 0.7, 1])
    .range(['#ff5a7a', '#ffba21', '#f5d76e', '#25e391'])(t)
}

function render() {
  const host = hostRef.value
  if (!host) return

  // 用 client*，并禁止用 min 高度把父级撑开（否则 ResizeObserver 会死循环）
  const width = Math.floor(host.clientWidth)
  const height = Math.floor(host.clientHeight)
  if (width < 40 || height < 40) return
  if (width === lastW && height === lastH && host.querySelector('svg')) return
  lastW = width
  lastH = height

  const margin = { top: 12, right: 12, bottom: 12, left: 12 }
  const w = width - margin.left - margin.right
  const h = height - margin.top - margin.bottom
  if (w <= 0 || h <= 0) return

  const domain = props.data.domain ?? 1.5
  const pts = props.data.points ?? []
  if (!pts.length) return

  d3.select(host).selectAll('*').remove()

  const svg = d3
    .select(host)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .style('display', 'block')
    .style('max-width', '100%')
    .style('max-height', '100%')

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

  /**坐标 */
  const x = d3.scaleLinear().domain([-domain, domain]).range([0, w])
  const y = d3.scaleLinear().domain([-domain, domain]).range([h, 0])

  const quads = [
    { x0: -domain, y0: 0, x1: 0, y1: domain, label: '小盘均衡', fill: 'rgba(25,235,255,0.06)' },
    { x0: 0, y0: 0, x1: domain, y1: domain, label: '大盘占优', fill: 'rgba(255,90,122,0.06)' },
    { x0: -domain, y0: -domain, x1: 0, y1: 0, label: '小盘占优', fill: 'rgba(37,227,145,0.06)' },
    { x0: 0, y0: -domain, x1: domain, y1: 0, label: '大盘均衡', fill: 'rgba(255,186,33,0.06)' }
  ]

  quads.forEach((q) => {
    g.append('rect')
      .attr('x', x(q.x0))
      .attr('y', y(q.y1))
      .attr('width', x(q.x1) - x(q.x0))
      .attr('height', y(q.y0) - y(q.y1))
      .attr('fill', q.fill)

    g.append('text')
      .attr('x', x((q.x0 + q.x1) / 2))
      .attr('y', y((q.y0 + q.y1) / 2))
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('fill', 'rgba(255,255,255,0.28)')
      .attr('font-size', 13)
      .attr('font-weight', 600)
      .text(q.label)
  })

  g.append('line')
    .attr('x1', 0)
    .attr('x2', w)
    .attr('y1', y(0))
    .attr('y2', y(0))
    .attr('stroke', 'rgba(255,255,255,0.35)')
    .attr('stroke-dasharray', '4,4')

  g.append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', 0)
    .attr('y2', h)
    .attr('stroke', 'rgba(255,255,255,0.35)')
    .attr('stroke-dasharray', '4,4')

  for (let i = 1; i < pts.length; i++) {
    const t = i / (pts.length - 1)
    g.append('line')
      .attr('x1', x(pts[i - 1].hp1))
      .attr('y1', y(pts[i - 1].hp2))
      .attr('x2', x(pts[i].hp1))
      .attr('y2', y(pts[i].hp2))
      .attr('stroke', colorAt(t))
      .attr('stroke-width', 3)
      .attr('stroke-linecap', 'round')
  }

  pts.forEach((p) => {
    if (!p.mark) return
    const cx = x(p.hp1)
    const cy = y(p.hp2)

    if (p.mark === 'now') {
      g.append('path')
        .attr('d', d3.symbol().type(d3.symbolDiamond).size(96)())
        .attr('transform', `translate(${cx},${cy})`)
        .attr('fill', '#25e391')
        .attr('stroke', '#0a1628')
        .attr('stroke-width', 1)

      g.append('text')
        .attr('x', cx + 10)
        .attr('y', cy - 8)
        .attr('fill', '#25e391')
        .attr('font-size', 11)
        .text('现在')
      return
    }

    const fill =
      p.mark === 'open' ? '#ff5a7a' : colorAt(pts.indexOf(p) / Math.max(pts.length - 1, 1))

    g.append('circle')
      .attr('cx', cx)
      .attr('cy', cy)
      .attr('r', p.mark === 'open' ? 5 : 4)
      .attr('fill', fill)
      .attr('stroke', '#0a1628')
      .attr('stroke-width', 1)

    g.append('text')
      .attr('x', cx + 8)
      .attr('y', cy - 8)
      .attr('fill', fill)
      .attr('font-size', 11)
      .text(p.mark === 'open' ? '开盘' : p.time)
  })
}

function scheduleRender() {
  cancelAnimationFrame(rafId)
  rafId = requestAnimationFrame(() => render())
}

onMounted(() => {
  scheduleRender()
  if (!hostRef.value) return
  // 观察绘图容器本身，且尺寸不变时不重绘
  resizeObserver = new ResizeObserver(() => scheduleRender())
  resizeObserver.observe(hostRef.value)
})

watch(
  () => props.data,
  () => {
    lastW = 0
    lastH = 0
    scheduleRender()
  },
  { deep: true }
)

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId)
  resizeObserver?.disconnect()
  resizeObserver = null
  if (hostRef.value) d3.select(hostRef.value).selectAll('*').remove()
})
</script>

<style scoped lang="scss">
.cap-phase-path {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cap-phase-path__legend {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
  margin-bottom: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.55);
}

.leg {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;

  &.is-tick {
    background: #19ebff;
  }
  &.is-open {
    background: #ffba21;
  }
}

.cap-phase-path__host {
  flex: 1 1 auto;
  height: 0;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  position: relative;
}
</style>
