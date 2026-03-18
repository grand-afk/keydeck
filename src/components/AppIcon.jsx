/**
 * AppIcon — renders an official product icon (img) if iconUrl is available,
 * falls back to the emoji icon field otherwise.
 * alt="" marks the image as decorative (the surrounding label provides the name).
 */
export default function AppIcon({ app, size = 16 }) {
  if (!app) return null
  if (app.iconUrl) {
    return (
      <img
        className="app-icon"
        src={app.iconUrl}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        onError={(e) => {
          // If the icon URL fails, swap to the emoji fallback span
          e.currentTarget.replaceWith(
            Object.assign(document.createElement('span'), {
              className: 'app-icon app-icon--emoji',
              textContent: app.icon || '📦',
            })
          )
        }}
      />
    )
  }
  return <span className="app-icon app-icon--emoji">{app.icon}</span>
}
