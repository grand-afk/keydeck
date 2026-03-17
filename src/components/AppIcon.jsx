/**
 * AppIcon — renders an official product icon (img) if iconUrl is available,
 * falls back to the emoji icon field otherwise.
 */
export default function AppIcon({ app, size = 16 }) {
  if (!app) return null
  if (app.iconUrl) {
    return (
      <img
        className="app-icon"
        src={app.iconUrl}
        alt={app.label}
        width={size}
        height={size}
        loading="lazy"
      />
    )
  }
  return <span className="app-icon app-icon--emoji">{app.icon}</span>
}
