/**
 * Section 6.4 open question: what model-count threshold should trigger a
 * hazard flag banner? Defaulting to "any 1 of N" — a minority severe-weather
 * signal is exactly the case section 6.4 says must not get averaged away.
 * Tune after real-world use (plan section 21).
 */
export const HAZARD_FLAG_MIN_MODELS = 1

/**
 * High-wind hazard threshold, checked against each model's wind gust
 * (falling back to sustained wind speed if gust is null). Not sourced from
 * the plan — a provisional default pending field tuning.
 */
export const HIGH_WIND_GUST_KPH = 60

/** Minimum precipitation amount for a model to count as "predicting precipitation" (section 5.4). */
export const PRECIPITATION_DETECTION_THRESHOLD_MM = 0.1
