import '@testing-library/jest-dom/vitest'

// jsdom doesn't implement scrollIntoView (used by HourlyTimeline).
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {}
}
