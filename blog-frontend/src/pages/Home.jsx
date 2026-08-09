import { useEffect, useState } from 'react'
import { Search, X, ArrowRight, PenLine } from 'lucide-react'
import { getPosts, searchPosts, getPostsByCategory } from '../api/posts'
import { getCategories } from '../api/categories'
import PostCard from '../components/PostCard'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PAGE_SIZE = 9

export default function Home() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [query, setQuery] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { getCategories().then(setCategories).catch(() => {}) }, [])
  useEffect(() => {
    setLoading(true); setError('')
    let request
    if (query) request = searchPosts(query, page, PAGE_SIZE).then(data => ({ content: activeCategory ? data.content.filter(p => p.category?.categoryId === activeCategory) : data.content, totalPages: data.totalPages }))
    else if (activeCategory) request = getPostsByCategory(activeCategory).then(content => ({ content, totalPages: 1 }))
    else request = getPosts(page, PAGE_SIZE).then(data => ({ content: data.content, totalPages: data.totalPages }))
    request.then(({content,totalPages}) => { setPosts(content); setTotalPages(Math.max(1,totalPages)) })
      .catch(() => setError('Could not load posts. Is the backend running?'))
      .finally(() => setLoading(false))
  }, [page, activeCategory, query])

  const submit = e => { e.preventDefault(); setPage(0); setQuery(searchInput.trim()) }
  const clear = () => { setSearchInput(''); setQuery(''); setPage(0) }
  const featured = !query && !activeCategory && page === 0 ? posts[0] : null
  const visiblePosts = featured ? posts.slice(1) : posts

  return (
    <div>
      <section className="site-shell pt-14 sm:pt-20">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-3.5 py-2 text-xs font-bold uppercase tracking-[.16em] text-accent"><span className="h-1.5 w-1.5 rounded-full bg-accent"/> Ideas from the community</div>
            <h1 className="max-w-4xl font-display text-5xl font-bold leading-[.98] tracking-tight sm:text-6xl lg:text-7xl">Stories worth <span className="text-accent">reading.</span></h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/55">Fresh writing on Java, Spring Boot, development, data structures and the things developers learn along the way.</p>
          </div>
          {user && <Link to="/write" className="primary-btn w-fit"><PenLine size={17}/> Share a story <ArrowRight size={16}/></Link>}
        </div>

        <form onSubmit={submit} className="relative mt-10 max-w-3xl">
          <Search size={19} className="absolute left-5 top-1/2 -translate-y-1/2 text-ink/35"/>
          <input value={searchInput} onChange={e=>setSearchInput(e.target.value)} placeholder="Search stories, topics, authors..." className="w-full rounded-full border border-ink/10 bg-white py-4 pl-13 pr-12 text-base shadow-[0_10px_40px_rgba(28,26,23,.05)] outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10"/>
          {query && <button type="button" onClick={clear} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 hover:bg-ink/5"><X size={17}/></button>}
        </form>

        {categories.length > 0 && <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
          <button onClick={()=>{setActiveCategory(null);setPage(0)}} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory===null?'bg-ink text-paper':'border border-ink/10 bg-white/60 hover:bg-white'}`}>All stories</button>
          {categories.map(c=><button key={c.categoryId} onClick={()=>{setActiveCategory(c.categoryId);setPage(0)}} className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${activeCategory===c.categoryId?'bg-ink text-paper':'border border-ink/10 bg-white/60 hover:bg-white'}`}>{c.categoryTitle}</button>)}
        </div>}
      </section>

      <main className="site-shell pb-20 pt-12 sm:pt-16">
        {loading && <div className="grid gap-6 md:grid-cols-3"><div className="h-72 animate-pulse rounded-3xl bg-ink/5 md:col-span-3"/><div className="h-80 animate-pulse rounded-3xl bg-ink/5"/><div className="h-80 animate-pulse rounded-3xl bg-ink/5"/><div className="h-80 animate-pulse rounded-3xl bg-ink/5"/></div>}
        {error && <div className="rounded-2xl bg-red-50 p-5 text-red-700">{error}</div>}
        {!loading && !error && posts.length === 0 && <div className="soft-card px-6 py-16 text-center"><h2 className="font-display text-3xl font-bold">No stories found</h2><p className="mt-2 text-ink/50">{query ? `Nothing matches “${query}”.` : 'Be the first person to publish a story.'}</p></div>}
        {!loading && !error && posts.length > 0 && (
          <>
            {featured && <div className="mb-14"><div className="mb-5 flex items-center justify-between"><h2 className="font-display text-2xl font-bold">Featured story</h2><span className="text-sm text-ink/40">Editor’s pick</span></div><PostCard post={featured} featured/></div>}
            <div className="mb-6 flex items-end justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{query ? 'Search results' : activeCategory ? 'Topic' : 'Latest stories'}</p><h2 className="mt-1 font-display text-3xl font-bold">{query || categories.find(c=>c.categoryId===activeCategory)?.categoryTitle || 'From the community'}</h2></div></div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{visiblePosts.map(post=><PostCard key={post.postId} post={post}/>)}</div>
            {!activeCategory && totalPages > 1 && <div className="mt-12 flex items-center justify-center gap-4"><button onClick={()=>setPage(p=>Math.max(0,p-1))} disabled={page===0} className="secondary-btn disabled:opacity-30">Previous</button><span className="text-sm text-ink/45">Page {page+1} of {totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} disabled={page>=totalPages-1} className="secondary-btn disabled:opacity-30">Next</button></div>}
          </>
        )}
      </main>
    </div>
  )
}
