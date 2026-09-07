import { agreementDots, agreementLabel } from '../weather/agreement'
import styles from './AgreementMeter.module.css'

export function AgreementMeter({ overall }: { overall: number }) {
  const pct = Math.round(overall * 100)
  return (
    <div className={styles.meter}>
      <div className={styles.percentage}>Model Agreement: {pct}%</div>
      <div className={styles.dots} aria-hidden="true">
        {agreementDots(overall)}
      </div>
      <div className={styles.label}>{agreementLabel(overall)}</div>
    </div>
  )
}
