import { useState } from 'react'
import * as authApi from '../api/auth'
import { useAuth } from '../context/AuthContext'
import { UserRound, LockKeyhole, CheckCircle2 } from 'lucide-react'

export default function Profile() {
  const { user, refreshUser }=useAuth()
  const [form,setForm]=useState({name:user.name,about:user.about||'',currentPassword:'',newPassword:''})
  const [error,setError]=useState(''); const [success,setSuccess]=useState(''); const [submitting,setSubmitting]=useState(false)
  const submit=async e=>{e.preventDefault();setError('');setSuccess('');setSubmitting(true);try{const payload={name:form.name,about:form.about};if(form.newPassword){payload.currentPassword=form.currentPassword;payload.newPassword=form.newPassword}const updated=await authApi.updateMe(payload);refreshUser(updated);setForm(f=>({...f,currentPassword:'',newPassword:''}));setSuccess('Your profile has been updated.')}catch(err){const d=err.response?.data;setError(d&&typeof d==='object'&&!d.message?Object.values(d).join(' · '):d?.message||'Could not update your profile.')}finally{setSubmitting(false)}}
  return <div className="site-shell py-12 sm:py-16"><div className="mx-auto max-w-3xl"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">Account</p><h1 className="mt-2 font-display text-4xl font-bold">Your profile</h1><p className="mt-2 text-ink/50">Manage your public details and password.</p></div>
    <div className="grid gap-6 md:grid-cols-[220px_1fr]"><aside className="soft-card h-fit p-6 text-center"><div className="mx-auto grid h-24 w-24 place-items-center rounded-[28px] bg-ink text-3xl font-bold text-paper">{user.name?.slice(0,1)?.toUpperCase()}</div><h2 className="mt-4 font-display text-xl font-bold">{user.name}</h2><p className="mt-1 break-all text-xs text-ink/45">{user.email}</p></aside>
      <form onSubmit={submit} className="soft-card p-6 sm:p-8"><div className="flex items-center gap-3 border-b border-ink/10 pb-5"><UserRound size={19}/><div><h2 className="font-semibold">Profile information</h2><p className="text-xs text-ink/45">This information appears on your posts.</p></div></div>
        <div className="mt-6 space-y-5"><div><label className="mb-2 block text-sm font-semibold">Name</label><input required minLength={3} value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="input-ui"/></div><div><label className="mb-2 block text-sm font-semibold">About</label><textarea rows={4} value={form.about} onChange={e=>setForm({...form,about:e.target.value})} className="input-ui resize-none"/></div></div>
        <div className="mt-8 border-t border-ink/10 pt-6"><div className="flex items-center gap-3"><LockKeyhole size={19}/><div><h2 className="font-semibold">Change password</h2><p className="text-xs text-ink/45">Leave these empty if you don't want to change it.</p></div></div><div className="mt-5 grid gap-4 sm:grid-cols-2"><input type="password" placeholder="Current password" value={form.currentPassword} onChange={e=>setForm({...form,currentPassword:e.target.value})} className="input-ui"/><input type="password" minLength={6} placeholder="New password" value={form.newPassword} onChange={e=>setForm({...form,newPassword:e.target.value})} className="input-ui"/></div></div>
        {error&&<p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}{success&&<p className="mt-5 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700"><CheckCircle2 size={16}/>{success}</p>}
        <button disabled={submitting} className="primary-btn mt-6">{submitting?'Saving...':'Save changes'}</button>
      </form></div></div></div>
}
