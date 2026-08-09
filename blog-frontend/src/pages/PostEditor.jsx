import { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import { useNavigate,useParams } from 'react-router-dom'
import { ImagePlus, ArrowLeft, Send } from 'lucide-react'
import { createPost,getPostById,updatePost,uploadPostImage } from '../api/posts'
import { getCategories } from '../api/categories'
import { API_BASE_URL } from '../api/client'
import { useAuth } from '../context/AuthContext'
const DEFAULT_IMAGES=['default.png','Default.png',null,undefined,'']
export default function PostEditor(){
 const {postId}=useParams();const isEditing=Boolean(postId);const {user,isAdmin}=useAuth();const navigate=useNavigate()
 const [categories,setCategories]=useState([]);const [form,setForm]=useState({title:'',content:'',categoryId:''});const [existingImage,setExistingImage]=useState(null);const [imageFile,setImageFile]=useState(null);const [preview,setPreview]=useState(null);const [error,setError]=useState('');const [submitting,setSubmitting]=useState(false);const [loading,setLoading]=useState(isEditing)
 useEffect(()=>{getCategories().then(setCategories).catch(()=>{})},[])
 useEffect(()=>{if(!isEditing)return;getPostById(postId).then(p=>{if(!isAdmin&&p.user?.id!==user?.id){navigate('/',{replace:true});return}setForm({title:p.title,content:p.content,categoryId:p.category?.categoryId||''});if(!DEFAULT_IMAGES.includes(p.imageName))setExistingImage(p.imageName)}).catch(()=>setError('Could not load this post.')).finally(()=>setLoading(false))},[postId,isEditing])
 const image=e=>{const f=e.target.files?.[0];if(!f)return;setImageFile(f);setPreview(URL.createObjectURL(f))}
 const submit=async e=>{e.preventDefault();setError('');if(!isEditing&&!form.categoryId){setError('Please choose a category.');return}setSubmitting(true);try{let id=postId;if(isEditing)await updatePost(postId,{title:form.title,content:form.content});else{id=(await createPost({title:form.title,content:form.content},user.id,Number(form.categoryId))).postId}if(imageFile)try{await uploadPostImage(id,imageFile)}catch{setError('Story saved, but the image failed to upload.')}navigate(`/post/${id}`)}catch(err){const d=err.response?.data;setError(d&&typeof d==='object'&&!d.message?Object.values(d).join(' · '):d?.message||'Something went wrong while saving.')}finally{setSubmitting(false)}}
 if(loading)return <div className="site-shell py-20 text-center text-ink/40">Loading editor...</div>
 const src=preview||(existingImage?`${API_BASE_URL}/images/${existingImage}`:null)
 return <div className="site-shell py-10 sm:py-14"><Link to={isEditing?`/post/${postId}`:'/'} className="inline-flex items-center gap-2 text-sm text-ink/45 hover:text-accent"><ArrowLeft size={15}/> Cancel</Link>
   <div className="mx-auto mt-8 max-w-4xl"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.18em] text-accent">{isEditing?'Edit story':'Create story'}</p><h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">{isEditing?'Refine your story.':'What do you want to share?'}</h1><p className="mt-3 text-ink/50">Write clearly, tell your story and publish when you're ready.</p></div>
   <form onSubmit={submit} className="soft-card overflow-hidden"><div className="p-6 sm:p-10"><input required minLength={4} value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Your story title..." className="w-full border-0 bg-transparent font-display text-4xl font-bold outline-none placeholder:text-ink/20 sm:text-5xl"/>
     <div className="mt-7 grid gap-5 sm:grid-cols-2">{!isEditing&&<div><label className="mb-2 block text-sm font-semibold">Topic</label><select required value={form.categoryId} onChange={e=>setForm({...form,categoryId:e.target.value})} className="input-ui"><option value="" disabled>Choose a category</option>{categories.map(c=><option key={c.categoryId} value={c.categoryId}>{c.categoryTitle}</option>)}</select></div>}
     <div><label className="mb-2 block text-sm font-semibold">Cover image <span className="font-normal text-ink/35">(optional)</span></label><label className="flex h-[52px] cursor-pointer items-center gap-3 overflow-hidden rounded-2xl border border-dashed border-ink/15 bg-ink/[.02] px-4 text-sm text-ink/50 hover:border-accent hover:text-accent">{src?<img src={src} className="h-9 w-12 rounded-lg object-cover" alt=""/>:<ImagePlus size={18}/>}<span>{src?'Change cover image':'Upload a cover image'}</span><input type="file" accept="image/*" onChange={image} className="hidden"/></label></div></div>
     <div className="my-8 border-t border-ink/10"/><textarea required minLength={4} value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Start writing your story..." rows={18} className="w-full resize-none border-0 bg-transparent text-lg leading-8 outline-none placeholder:text-ink/25"/>
     {error&&<p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
   </div><div className="flex items-center justify-between border-t border-ink/10 bg-ink/[.02] px-6 py-5 sm:px-10"><span className="text-xs text-ink/35">Your story will be visible to the Inkwell community.</span><button disabled={submitting} className="primary-btn">{submitting?'Publishing...':isEditing?'Save changes':'Publish story'}<Send size={15}/></button></div></form></div>
 </div>
}
