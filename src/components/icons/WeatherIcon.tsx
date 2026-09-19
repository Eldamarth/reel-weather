import { CONDITION_DISPLAY } from '../../weather/condition'
import type { DisplayCondition } from '../../weather/models'

/**
 * Hand-authored, no external icon set / attribution. Design goals (the
 * problem native emoji had): every condition must be tellable apart at a
 * glance, even at ~16-20px, and rain intensity must actually look different
 * — not just carry a different label. Distinctions used, layered:
 *
 * - presence/absence of sun (clear family vs. everything else)
 * - presence/absence of a cloud (cloudy has one and nothing else; fog has
 *   none at all — a completely different silhouette from every other icon)
 * - cloud darkness, scaling with severity (light grey -> slate -> near-black
 *   from mostly-clear through thunderstorm)
 * - what's below the cloud and how much of it: streak count/thickness for
 *   rain intensity, crossed-line flakes for snow, a bolt for storms
 */

const SUN = '#FFC94A'
const CLOUD_PALE = '#C9D2D8'
const CLOUD_LIGHT = '#B9C6CE'
const CLOUD_MEDIUM_LIGHT = '#AEB9C2'
const CLOUD_MEDIUM = '#8FA0AC'
const CLOUD_DARK = '#5E6E7A'
const CLOUD_DARKEST = '#495662'
const RAIN_LIGHT = '#4FB0E0'
const RAIN_MEDIUM = '#3A93C9'
const RAIN_DEEP = '#2E7AB0'
const SNOW = '#EAF6FF'
const BOLT = '#FFD23F'
const FOG = '#B9C6CE'

function SunShape({ cx, cy, r, rays }: { cx: number; cy: number; r: number; rays: boolean }) {
  if (!rays) return <circle cx={cx} cy={cy} r={r} fill={SUN} />
  const inner = r + 2.2
  const outer = r + 4.8
  const angles = [0, 45, 90, 135, 180, 225, 270, 315]
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill={SUN} />
      {angles.map((deg) => {
        const rad = (deg * Math.PI) / 180
        const x1 = cx + inner * Math.cos(rad)
        const y1 = cy + inner * Math.sin(rad)
        const x2 = cx + outer * Math.cos(rad)
        const y2 = cy + outer * Math.sin(rad)
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={SUN}
            strokeWidth={1.8}
            strokeLinecap="round"
          />
        )
      })}
    </>
  )
}

/** Classic "cluster of circles + base bar" cloud silhouette, positioned/scaled by caller. */
function CloudShape({
  fill,
  cx = 13,
  cy = 12.6,
  scale = 1,
}: {
  fill: string
  cx?: number
  cy?: number
  scale?: number
}) {
  return (
    <g fill={fill} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
      <circle cx={cx - 4.5} cy={cy + 0.4} r={3.6} />
      <circle cx={cx} cy={cy - 2.6} r={4.6} />
      <circle cx={cx + 4.3} cy={cy + 0.6} r={3.2} />
      <rect x={cx - 7} y={cy - 1} width={14} height={4.4} rx={2.2} />
    </g>
  )
}

function RainStreaks({
  count,
  color,
  strokeWidth,
  y0,
  y1,
}: {
  count: number
  color: string
  strokeWidth: number
  y0: number
  y1: number
}) {
  const spread = 13
  const startX = 12 - spread / 2
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const x = startX + (spread / (count - 1)) * i
        return (
          <line
            key={i}
            x1={x}
            y1={y0}
            x2={x - 1.4}
            y2={y1}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
        )
      })}
    </>
  )
}

function Snowflake({ x, y }: { x: number; y: number }) {
  const r = 1.8
  const d = r * 0.7
  return (
    <g stroke={SNOW} strokeWidth={1.3} strokeLinecap="round">
      <line x1={x - r} y1={y} x2={x + r} y2={y} />
      <line x1={x} y1={y - r} x2={x} y2={y + r} />
      <line x1={x - d} y1={y - d} x2={x + d} y2={y + d} />
      <line x1={x - d} y1={y + d} x2={x + d} y2={y - d} />
    </g>
  )
}

/** Proven bolt silhouette (a linearly rescaled Heroicons "zap" path), not freehand geometry. */
function Bolt() {
  return <path d="M13,16.9 L13,13 L8,19.1 L11.9,19.1 L11.9,23 L16.9,16.9 L13,16.9 Z" fill={BOLT} />
}

function FogBands() {
  const lines = [
    { y: 6.5, x1: 4, x2: 17 },
    { y: 11, x1: 7, x2: 20 },
    { y: 15.5, x1: 4, x2: 17 },
    { y: 20, x1: 7, x2: 20 },
  ]
  return (
    <>
      {lines.map((l) => (
        <line
          key={l.y}
          x1={l.x1}
          y1={l.y}
          x2={l.x2}
          y2={l.y}
          stroke={FOG}
          strokeWidth={2.2}
          strokeLinecap="round"
        />
      ))}
    </>
  )
}

const ICON_BODIES: Record<DisplayCondition, () => React.ReactNode> = {
  clear: () => <SunShape cx={12} cy={12} r={5.5} rays />,
  'mostly-clear': () => (
    <>
      <SunShape cx={9} cy={9} r={4.2} rays={false} />
      <CloudShape fill={CLOUD_PALE} cx={16} cy={16.5} scale={0.5} />
    </>
  ),
  'partly-cloudy': () => (
    <>
      <SunShape cx={8.5} cy={8.5} r={4} rays={false} />
      <CloudShape fill={CLOUD_LIGHT} cx={13.5} cy={13.5} scale={1} />
    </>
  ),
  cloudy: () => <CloudShape fill={CLOUD_MEDIUM_LIGHT} cx={13} cy={13} scale={1} />,
  'light-rain': () => (
    <>
      <CloudShape fill={CLOUD_MEDIUM_LIGHT} cx={13} cy={10.5} scale={0.9} />
      <RainStreaks count={2} color={RAIN_LIGHT} strokeWidth={2} y0={16} y1={19.5} />
    </>
  ),
  rain: () => (
    <>
      <CloudShape fill={CLOUD_MEDIUM} cx={13} cy={10.5} scale={0.95} />
      <RainStreaks count={4} color={RAIN_MEDIUM} strokeWidth={2.4} y0={16} y1={20} />
    </>
  ),
  'heavy-rain': () => (
    <>
      <CloudShape fill={CLOUD_DARK} cx={13} cy={10} scale={1.05} />
      <RainStreaks count={6} color={RAIN_DEEP} strokeWidth={2.8} y0={15.5} y1={21} />
    </>
  ),
  snow: () => (
    <>
      <CloudShape fill={CLOUD_PALE} cx={13} cy={10.5} scale={0.9} />
      <Snowflake x={9} y={17.5} />
      <Snowflake x={13.5} y={19} />
      <Snowflake x={18} y={17.5} />
    </>
  ),
  thunderstorm: () => (
    <>
      <CloudShape fill={CLOUD_DARKEST} cx={13} cy={10} scale={1.05} />
      <Bolt />
    </>
  ),
  fog: () => <FogBands />,
}

export interface WeatherIconProps {
  condition: DisplayCondition
  size?: number
  className?: string
}

export function WeatherIcon({ condition, size = 24, className }: WeatherIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={CONDITION_DISPLAY[condition].label}
      className={className}
    >
      {ICON_BODIES[condition]()}
    </svg>
  )
}
