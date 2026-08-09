import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth(); const navigate = useNavigate(); const location = useLocation()
  const [form,setForm]=useState({email:'',password:''}); const [error,setError]=useState(''); const [submitting,setSubmitting]=useState(false)
  const from=location.state?.from?.pathname||'/'
  const submit=async e=>{e.preventDefault();setError('');setSubmitting(true);try{await login(form.email,form.password);navigate(from,{replace:true})}catch(err){setError(err.response?.data?.message||'Invalid email or password')}finally{setSubmitting(false)}}
  return <div className="site-shell flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-[0_30px_100px_rgba(28,26,23,.1)] md:grid-cols-2">
      <div className="hidden bg-ink p-10 text-paper md:flex md:flex-col md:justify-between"><div><span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10"><Sparkles size={19}/></span><h2 className="mt-10 font-display text-5xl font-bold leading-none">Welcome<br/>back.</h2><p className="mt-5 max-w-xs leading-7 text-paper/55">Pick up where you left off. Read something interesting or share what you have learned.</p></div><p className="text-sm text-paper/35">Inkwell · Write. Read. Grow.</p></div>
      <div className="p-7 sm:p-10"><h1 className="font-display text-3xl font-bold">Sign in</h1><p className="mt-2 text-ink/50">Welcome back to Inkwell.</p>
        <form onSubmit={submit} className="mt-8 space-y-5">
          <div><label className="mb-2 block text-sm font-semibold">Email</label><div className="relative"><Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"/><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-ui pl-11"/></div></div>
          <div><label className="mb-2 block text-sm font-semibold">Password</label><div className="relative"><LockKeyhole size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/30"/><input type="password" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-ui pl-11"/></div></div>
          {error&&<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="primary-btn w-full">{submitting?'Signing in...':'Sign in'}<ArrowRight size={17}/></button>
        </form>
        <p className="mt-7 text-center text-sm text-ink/50">New to Inkwell? <Link to="/register" className="font-semibold text-accent hover:underline">Create an account</Link></p>
      </div>
    </div>
  </div>
}
