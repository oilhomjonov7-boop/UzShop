// Universal image fallback utility for resilient product image display
export const getFallbackImageUrl = (title = 'UzShop', category = '') => {
  const cleanTitle = (title || 'UzShop').replace(/[<>&"]/g, '').slice(0, 30);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
    <rect width="400" height="400" fill="#F8FAFC"/>
    <rect x="24" y="24" width="352" height="352" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2"/>
    <circle cx="200" cy="175" r="46" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
    <path d="M185 165 C185 156.7 191.7 150 200 150 C208.3 150 215 156.7 215 165 C215 173.3 208.3 180 200 180 Z" fill="#64748B"/>
    <path d="M168 206 C168 191 182.3 179 200 179 C217.7 179 232 191 232 206 Z" fill="#94A3B8"/>
    <text x="200" y="260" text-anchor="middle" fill="#0F172A" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600">${cleanTitle}</text>
    <rect x="150" y="285" width="100" height="24" rx="6" fill="#ECFDF5" stroke="#10B981" stroke-width="1"/>
    <text x="200" y="301" text-anchor="middle" fill="#059669" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" letter-spacing="1">UZSHOP</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const handleImageError = (e, fallbackTitle = 'UzShop') => {
  if (e?.currentTarget) {
    e.currentTarget.onerror = null;
    e.currentTarget.src = getFallbackImageUrl(fallbackTitle);
  }
};
