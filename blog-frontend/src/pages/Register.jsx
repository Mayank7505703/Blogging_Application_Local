import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register }=useAuth(); const navigate=useNavigate()
  const [form,setForm]=useState({name:'',email:'',password:'',about:''}); const [error,setError]=useState(''); const [submitting,setSubmitting]=useState(false)
  const submit=async e=>{e.preventDefault();setError('');setSubmitting(true);try{await register(form);navigate('/',{replace:true})}catch(err){const d=err.response?.data;setError(d&&typeof d==='object'&&!d.message?Object.values(d).join(' · '):d?.message||'Could not create your account')}finally{setSubmitting(false)}}
  return <div className="site-shell flex min-h-[calc(100vh-150px)] items-center justify-center py-12">
    <div className="grid w-full max-w-4xl overflow-hidden rounded-[32px] border border-ink/10 bg-white shadow-[0_30px_100px_rgba(28,26,23,.1)] md:grid-cols-2">
      <div className="p-7 sm:p-10"><div className="flex items-center gap-2 text-sm font-bold"><span className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-paper"><Sparkles size={15}/></span> Inkwell</div><h1 className="mt-8 font-display text-3xl font-bold">Create your account</h1><p className="mt-2 text-ink/50">Join the community and publish your ideas.</p>
        <form onSubmit={submit} className="mt-7 space-y-4">
          <div><label className="mb-2 block text-sm font-semibold">Name</label><input required minLength={3} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-ui"/></div>
          <div><label className="mb-2 block text-sm font-semibold">Email</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="input-ui"/></div>
          <div><label className="mb-2 block text-sm font-semibold">Password</label><input type="password" required minLength={6} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="input-ui"/><p className="mt-1.5 text-xs text-ink/35">At least 6 characters.</p></div>
          <div><label className="mb-2 block text-sm font-semibold">About <span className="font-normal text-ink/35">(optional)</span></label><textarea rows={2} value={form.about} onChange={e=>setForm({...form,about:e.target.value})} className="input-ui resize-none"/></div>
          {error&&<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          <button disabled={submitting} className="primary-btn w-full">{submitting?'Creating account...':'Create account'}<ArrowRight size={17}/></button>
        </form><p className="mt-6 text-center text-sm text-ink/50">Already a member? <Link to="/login" className="font-semibold text-accent">Sign in</Link></p>
      </div>
      <div className="hidden bg-gradient-to-br from-orange-100 via-paper to-stone-200 p-10 md:flex md:flex-col md:justify-end"><p className="text-sm font-bold uppercase tracking-[.2em] text-accent">Your space to write</p><h2 className="mt-4 font-display text-5xl font-bold leading-none">Turn your<br/>knowledge<br/>into stories.</h2><p className="mt-5 max-w-sm text-ink/55 leading-7">Build your voice, share your engineering journey and learn from other developers.</p></div>
    </div>
  </div>
}
