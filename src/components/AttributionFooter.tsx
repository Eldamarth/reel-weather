import styles from './AttributionFooter.module.css'

/** Section 7.4: permanent, unobtrusive CC BY 4.0 attribution. */
export function AttributionFooter() {
  return (
    <footer className={styles.footer}>
      Weather data © <a href="https://open-meteo.com/">Open-Meteo.com</a> (CC BY 4.0). Reel Weather
      combines and transforms multiple model forecasts into a single consensus view; it does not
      reproduce Open-Meteo&rsquo;s data unmodified.
    </footer>
  )
}
