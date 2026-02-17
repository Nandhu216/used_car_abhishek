function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

/**
 * Simple heuristic:
 * - base: starts at 1,000,000 and adjusts by year and mileage
 * - not meant to be accurate, meant to be explainable for demos
 */
function recommendPrice({ year, mileage, brand, model }) {
  const nowYear = new Date().getFullYear();
  const age = clamp(nowYear - Number(year || nowYear), 0, 30);
  const km = clamp(Number(mileage || 0), 0, 500000);

  let base = 1000000;
  base -= age * 55000; // depreciation per year
  base -= Math.floor(km / 10000) * 15000; // depreciation per 10k km

  // slight bump for popular brands (demo-friendly)
  const popular = ["Toyota", "Honda", "Hyundai", "Suzuki", "Kia"];
  if (popular.includes(String(brand || "").trim())) base += 40000;

  const recommendedPrice = Math.max(80000, Math.round(base / 1000) * 1000);

  return {
    recommendedPrice,
    explanation: {
      nowYear,
      age,
      mileageKm: km,
      inputs: { brand: brand || "", model: model || "", year, mileage },
      notes: [
        "This is a simple heuristic for demo purposes.",
        "Price decreases with car age and higher mileage.",
      ],
    },
  };
}

module.exports = { recommendPrice };

