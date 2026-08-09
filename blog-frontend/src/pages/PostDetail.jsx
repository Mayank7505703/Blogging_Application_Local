import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Pencil, Trash2, Send, ArrowLeft, Clock3, MessageCircle } from 'lucide-react'
import { getPostById, deletePost, getComments, addComment, deleteComment } from '../api/posts'
import { API_BASE_URL } from '../api/client'
import { useAuth } from '../context/AuthContext'

const DEFAULT_IMAGES=['default.png','Default.png',null,undefined,'']
const initials=n=>(n||'U').split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase()
const readingTime=c=>Math.max(1,Math.ceil((c||'').trim().split(/\s+/).length/180))
export default function PostDetail(){
 const {postId}=useParams();const {user,isAdmin}=useAuth();const navigate=useNavigate();const [post,setPost]=useState(null);const [error,setError]=useState('');const [comments,setComments]=useState([]);const [commentText,setCommentText]=useState('');const [posting,setPosting]=useState(false);const [deleting,setDeleting]=useState(false)
 useEffect(()=>{getPostById(postId).then(setPost).catch(()=>setError('This post could not be found.'))},[postId]);useEffect(()=>{getComments(postId).then(setComments).catch(()=>{})},[postId])
 if(error)return <div className="site-shell py-20 text-center"><p className="text-red-600">{error}</p><Link to="/" className="mt-5 inline-flex text-accent">Back home</Link></div>
 if(!post)return <div className="site-shell py-20 text-center text-ink/40">Loading story...</div>
 const canEdit=user&&(isAdmin||user.id===post.user?.id);const hasImage=!DEFAULT_IMAGES.includes(post.imageName);const date=post.publishDate?new Date(post.publishDate).toLocaleDateString(undefined,{month:'long',day:'numeric',year:'numeric'}):'Recently'
 const del=async()=>{if(!window.confirm('Delete this post? This cannot be undone.'))return;setDeleting(true);try{await deletePost(postId);navigate('/')}catch{setError('Could not delete post.');setDeleting(false)}}
 const add=async e=>{e.preventDefault();if(!commentText.trim())return;setPosting(true);try{const c=await addComment(postId,commentText.trim());setComments(x=>[...x,c]);setCommentText('')}catch{}finally{setPosting(false)}}
 return <article className="pb-20"><div className="site-shell pt-10"><Link to="/" className="inline-flex items-center gap-2 text-sm text-ink/45 hover:text-accent"><ArrowLeft size={15}/> Back to stories</Link>
   <div className="mx-auto max-w-4xl pt-12 text-center"><span className="inline-flex rounded-full bg-accent/8 px-3 py-1.5 text-xs font-bold uppercase tracking-[.15em] text-accent">{post.category?.categoryTitle||'Story'}</span><h1 className="mt-5 font-display text-4xl font-bold leading-[1.03] sm:text-6xl">{post.title}</h1><p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-ink/50">{post.content?.slice(0,180)}{post.content?.length>180?'...':''}</p>
   <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-sm text-ink/50"><span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-xs font-bold text-paper">{initials(post.user?.name)}</span><span className="font-semibold text-ink">{post.user?.name||'Unknown author'}</span><span>•</span><span>{date}</span><span>•</span><span className="flex items-center gap-1"><Clock3 size={14}/>{readingTime(post.content)} min read</span></div>
   {canEdit&&<div className="mt-5 flex justify-center gap-2"><Link to={`/post/${post.postId}/edit`} className="secondary-btn py-2"><Pencil size={14}/> Edit</Link><button onClick={del} disabled={deleting} className="secondary-btn py-2 text-red-600"><Trash2 size={14}/> {deleting?'Deleting':'Delete'}</button></div>}</div>
   {hasImage?<img src={`${API_BASE_URL}/images/${post.imageName}`} alt="" className="mx-auto mt-12 max-h-[580px] w-full max-w-5xl rounded-[32px] object-cover shadow-xl"/>:<div className="mx-auto mt-12 flex h-72 max-w-5xl items-end rounded-[32px] bg-gradient-to-br from-orange-100 via-paper to-stone-200 p-10"><span className="font-display text-6xl font-bold text-ink/10">Inkwell</span></div>}
   <div className="mx-auto mt-14 max-w-2xl"><div className="prose-content text-[17px] text-ink/80">{post.content}</div></div>
   <section className="mx-auto mt-16 max-w-2xl border-t border-ink/10 pt-10"><div className="flex items-center gap-2"><MessageCircle size={19}/><h2 className="font-display text-2xl font-bold">Comments</h2><span className="text-sm text-ink/35">{comments.length}</span></div>
    {user?<form onSubmit={add} className="mt-6"><textarea value={commentText} onChange={e=>setCommentText(e.target.value)} rows={3} placeholder="Join the conversation..." className="input-ui resize-none"/><button disabled={posting||!commentText.trim()} className="primary-btn mt-3">{posting?'Posting...':'Post comment'}<Send size={15}/></button></form>:<p className="mt-5 rounded-2xl bg-ink/5 p-4 text-sm text-ink/55"><Link to="/login" className="font-semibold text-accent">Sign in</Link> to leave a comment.</p>}
    <ul className="mt-8 space-y-5">{comments.map(c=><li key={c.commentId} className="flex gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent/10 text-xs font-bold text-accent">{initials(c.user?.name)}</span><div className="min-w-0 flex-1 rounded-2xl bg-white/70 p-4"><div className="flex items-center gap-2"><span className="text-sm font-semibold">{c.user?.name}</span>{c.createdAt&&<span className="text-xs text-ink/35">{new Date(c.createdAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})}</span>}{(isAdmin||user?.id===c.user?.id)&&<button onClick={async()=>{await deleteComment(c.commentId);setComments(x=>x.filter(a=>a.commentId!==c.commentId))}} className="ml-auto text-xs text-ink/30 hover:text-red-600">Delete</button>}</div><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-ink/70">{c.content}</p></div></li>)}</ul>
    {!comments.length&&<p className="mt-8 text-sm text-ink/40">No comments yet. Start the conversation.</p>}
   </section>
 </div></article>
}
