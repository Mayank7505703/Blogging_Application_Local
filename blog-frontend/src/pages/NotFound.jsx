import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="font-display text-5xl font-bold mb-4">404</h1>
      <p className="text-ink/60 mb-6">This page doesn't exist.</p>
      <Link to="/" className="text-accent font-medium hover:underline">Back to home</Link>
    </div>
  )
}
