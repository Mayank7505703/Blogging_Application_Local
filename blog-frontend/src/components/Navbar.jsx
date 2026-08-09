import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { PenLine, LogOut, UserRound, LayoutGrid, Menu, X, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); setOpen(false); navigate('/') }
  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/90 backdrop-blur-xl">
      <div className="site-shell flex h-[76px] items-center justify-between">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-ink text-paper shadow-sm">
            <Sparkles size={18} />
          </span>
          <span className="font-display text-2xl font-bold tracking-tight">Inkwell</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={`rounded-full px-4 py-2.5 text-sm font-medium transition ${isActive('/') ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}>Home</Link>
          {user && <Link to="/write" className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium transition ${isActive('/write') ? 'bg-ink text-paper' : 'hover:bg-ink/5'}`}><PenLine size={16}/> Write</Link>}
          {isAdmin && <Link to="/categories" className="flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-ink/5"><LayoutGrid size={16}/> Categories</Link>}
          {user ? (
            <>
              <Link to="/dashboard" className={`ml-1 flex items-center gap-2 rounded-full border border-ink/10 bg-white/60 px-3 py-2 text-sm font-medium transition hover:bg-white ${isActive('/dashboard') ? 'ring-2 ring-accent/20' : ''}`}>
                <span className="grid h-7 w-7 place-items-center rounded-full bg-accent/10 text-xs font-bold text-accent">{user.name?.slice(0,1)?.toUpperCase()}</span>
                {user.name}
              </Link>
              <Link to="/profile" title="Settings" className="ml-1 rounded-full p-2.5 text-ink/60 hover:bg-ink/5 hover:text-ink"><UserRound size={18}/></Link>
              <button onClick={handleLogout} title="Logout" className="rounded-full p-2.5 text-ink/50 hover:bg-red-50 hover:text-red-600"><LogOut size={18}/></button>
            </>
          ) : (
            <>
              <Link to="/login" className="ml-2 rounded-full px-4 py-2.5 text-sm font-medium hover:bg-ink/5">Log in</Link>
              <Link to="/register" className="primary-btn ml-1 py-2.5">Get started</Link>
            </>
          )}
        </nav>

        <button className="rounded-xl p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={23}/> : <Menu size={23}/>}
        </button>
      </div>

      {open && (
        <nav className="site-shell flex flex-col gap-2 border-t border-ink/10 py-4 md:hidden">
          <Link className="pill" to="/" onClick={() => setOpen(false)}>Home</Link>
          {user ? (
            <>
              <Link className="pill" to="/write" onClick={() => setOpen(false)}>Write</Link>
              <Link className="pill" to="/dashboard" onClick={() => setOpen(false)}>My posts</Link>
              <Link className="pill" to="/profile" onClick={() => setOpen(false)}>Settings</Link>
              {isAdmin && <Link className="pill" to="/categories" onClick={() => setOpen(false)}>Categories</Link>}
              <button className="pill justify-start text-red-600" onClick={handleLogout}><LogOut size={15}/> Logout</button>
            </>
          ) : (
            <>
              <Link className="pill" to="/login" onClick={() => setOpen(false)}>Log in</Link>
              <Link className="primary-btn" to="/register" onClick={() => setOpen(false)}>Get started</Link>
            </>
          )}
        </nav>
      )}
    </header>
  )
}
