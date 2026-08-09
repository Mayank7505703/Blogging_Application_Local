import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { createCategory, deleteCategory, getCategories } from '../api/categories'

export default function Categories() {
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ categoryTitle: '', categoryDescription: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = () => {
    getCategories().then(setCategories).finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await createCategory(form)
      setForm({ categoryTitle: '', categoryDescription: '' })
      load()
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create category.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category? Posts in it will be removed too.')) return
    await deleteCategory(id)
    setCategories((prev) => prev.filter((c) => c.categoryId !== id))
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-display text-3xl font-bold mb-8">Categories</h1>

      <form onSubmit={handleSubmit} className="border border-ink/10 rounded-xl p-5 mb-10 space-y-3">
        <h2 className="font-medium">Add a category</h2>
        <input
          required
          minLength={4}
          placeholder="Title"
          value={form.categoryTitle}
          onChange={(e) => setForm({ ...form, categoryTitle: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
        <input
          required
          minLength={4}
          placeholder="Description"
          value={form.categoryDescription}
          onChange={(e) => setForm({ ...form, categoryDescription: e.target.value })}
          className="w-full border border-ink/20 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="bg-ink text-paper px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors">
          Add category
        </button>
      </form>

      {loading && <p className="text-ink/50">Loading…</p>}

      <ul className="divide-y divide-ink/10">
        {categories.map((c) => (
          <li key={c.categoryId} className="py-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-medium">{c.categoryTitle}</p>
              <p className="text-sm text-ink/60">{c.categoryDescription}</p>
            </div>
            <button onClick={() => handleDelete(c.categoryId)} className="text-ink/60 hover:text-red-600">
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
