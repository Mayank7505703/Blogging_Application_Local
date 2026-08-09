import { Route, Routes, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import PostEditor from './pages/PostEditor'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import { ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
 return <div className="min-h-screen flex flex-col"><Navbar/><main className="flex-1">
  <Routes>
   <Route path="/" element={<Home/>}/><Route path="/login" element={<Login/>}/><Route path="/register" element={<Register/>}/><Route path="/post/:postId" element={<PostDetail/>}/>
   <Route path="/write" element={<ProtectedRoute><PostEditor/></ProtectedRoute>}/><Route path="/post/:postId/edit" element={<ProtectedRoute><PostEditor/></ProtectedRoute>}/>
   <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/><Route path="/categories" element={<ProtectedRoute adminOnly><Categories/></ProtectedRoute>}/><Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/><Route path="*" element={<NotFound/>}/>
  </Routes></main>
  <footer className="border-t border-ink/10 bg-white/40"><div className="site-shell flex flex-col gap-4 py-8 sm:flex-row sm:items-center sm:justify-between"><Link to="/" className="font-display text-xl font-bold">Inkwell.</Link><p className="text-sm text-ink/40">A place for ideas, stories and everything worth sharing.</p><p className="text-xs text-ink/30">Built with React + Spring Boot</p></div></footer>
 </div>
}
