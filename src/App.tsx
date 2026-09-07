import { useEffect, useState } from 'react'
import {
  demonstrateCombinedRequestHazard,
  runSpike,
  type LocationSpikeReport,
} from './spike/openMeteoSpike'

/**
 * Temporary Phase 1 spike harness (plan section 20). This is NOT the app UI —
 * it exists only to prove the fetches work from an actual browser page (real
 * CORS, not curl) and to give a human-readable dump of what each model
 * returned. Replace this component entirely in Phase 3.
 */
function App() {
  const [reports, setReports] = useState<LocationSpikeReport[] | null>(null)
  const [hazard, setHazard] = useState<{
    goodOrderParsed: boolean
    badOrderParsed: boolean
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    runSpike()
      .then(setReports)
      .catch((err) => setError(String(err)))
    demonstrateCombinedRequestHazard()
      .then(setHazard)
      .catch((err) => setError(String(err)))
  }, [])

  return (
    <main style={{ padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
      <h1>Reel Weather — Phase 1 API Spike</h1>
      <p>
        If model rows below populated without a CORS error in the browser console, direct
        browser-to-Open-Meteo fetching is confirmed viable.
      </p>

      {error && <p style={{ color: 'salmon' }}>Error: {error}</p>}

      {hazard && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h2>Combined-request order hazard</h2>
          <p>
            ncep_hrrr_conus,metno_nordic (available model first) parsed:{' '}
            {String(hazard.goodOrderParsed)}
          </p>
          <p>
            metno_nordic,ncep_hrrr_conus (unavailable model first) parsed:{' '}
            {String(hazard.badOrderParsed)}
          </p>
        </section>
      )}

      {!reports && !error && <p>Loading…</p>}

      {reports?.map((report) => (
        <section key={report.location.name} style={{ marginBottom: '2rem' }}>
          <h2>{report.location.name}</h2>
          <table border={1} cellPadding={4} style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Model</th>
                <th>Status</th>
                <th>Detail</th>
              </tr>
            </thead>
            <tbody>
              {report.results.map((result) => (
                <tr key={result.modelId}>
                  <td>{result.modelId}</td>
                  <td>{result.status}</td>
                  <td>
                    {result.status === 'ok' &&
                      `horizon=${result.horizonHours}h, lastData=${result.lastNonNullTimestamp}, tz=${result.resolvedTimezone}, missingVars=[${result.missingVariables.join(', ')}]`}
                    {result.status === 'unavailable-clean' &&
                      `HTTP ${result.httpStatus}: ${result.reason}`}
                    {result.status === 'unavailable-malformed-json' &&
                      `HTTP ${result.httpStatus}, JSON.parse threw — raw: ${result.rawSnippet}`}
                    {result.status === 'network-error' && result.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </main>
  )
}

export default App
