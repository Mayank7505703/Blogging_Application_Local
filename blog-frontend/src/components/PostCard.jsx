import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3 } from 'lucide-react'
import { API_BASE_URL } from '../api/client'

const DEFAULT_IMAGES = [
    'default.png',
    'Default.png',
    null,
    undefined,
    ''
]

function initials(name = '') {
    return (
        name
            .trim()
            .split(/\s+/)
            .map(w => w[0])
            .slice(0, 2)
            .join('')
            .toUpperCase() || 'U'
    )
}

function readingTime(content = '') {
    const words = content.trim()
        ? content.trim().split(/\s+/).length
        : 0

    return Math.max(1, Math.ceil(words / 180))
}

/*
 * IMAGE URL HANDLER
 *
 * Case 1:
 * Cloudinary URL
 * https://res.cloudinary.com/...
 *
 * -> Use directly
 *
 * Case 2:
 * Old local filename
 * abc123.jpg
 *
 * -> Use backend:
 * http://localhost:8080/images/abc123.jpg
 *
 * Case 3:
 * No image
 *
 * -> Return null
 */
function getImageUrl(imageName) {
    if (!imageName) {
        return null
    }

    const image = String(imageName).trim()

    if (!image || DEFAULT_IMAGES.includes(image)) {
        return null
    }

    // Already a complete URL
    if (
        image.startsWith('http://') ||
        image.startsWith('https://')
    ) {
        return image
    }

    // Old local image
    return `${API_BASE_URL}/images/${encodeURIComponent(image)}`
}

export default function PostCard({ post, featured = false }) {

    if (!post) {
        return null
    }

    const imageUrl = getImageUrl(post.imageName)
    const hasImage = Boolean(imageUrl)

    const date = post.publishDate
        ? new Date(post.publishDate).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Recently'

    const category =
        post.category?.categoryTitle || 'Story'

    const author =
        post.user?.name || 'Unknown author'


    /* =====================================================
       FEATURED CARD
       ===================================================== */

    if (featured) {
        return (
            <Link
                to={`/post/${post.postId}`}
                className="group grid w-full max-w-[1100px] overflow-hidden rounded-[28px] border border-ink/10 bg-ink text-paper shadow-[0_25px_80px_rgba(28,26,23,.16)] lg:grid-cols-[1.08fr_.92fr] lg:h-[420px]"
            >

                {/* LEFT SIDE */}

                <div className="flex h-full flex-col justify-between overflow-hidden p-8 sm:p-10">

                    <div>

                        <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                            {category}
                        </span>

                        <h2
                            className="mt-6 max-w-2xl overflow-hidden text-4xl font-semibold leading-tight sm:text-5xl"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {post.title}
                        </h2>

                        <p
                            className="mt-5 max-w-2xl overflow-hidden text-base leading-7 text-white/70"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical'
                            }}
                        >
                            {post.content}
                        </p>

                    </div>

                    <div className="mt-8 flex items-center justify-between">

                        <div className="flex items-center gap-3">

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-semibold">
                                {initials(author)}
                            </div>

                            <div className="line-clamp-1 text-sm text-white/80">
                                {author} · {date}
                            </div>

                        </div>

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-ink transition duration-300 group-hover:translate-x-1">
                            <ArrowUpRight size={22} />
                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE IMAGE */}

                <div className="relative h-[260px] overflow-hidden bg-white/5 lg:h-full">

                    {hasImage ? (
                        <img
                            src={imageUrl}
                            alt={post.title || ''}
                            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                            loading="lazy"
                            onError={(e) => {
                                console.error(
                                    'Failed to load image:',
                                    imageUrl
                                )

                                e.currentTarget.style.display = 'none'
                            }}
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center">
                            <span className="text-4xl font-semibold text-white/10">
                                Inkwell
                            </span>
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />

                </div>

            </Link>
        )
    }


    /* =====================================================
       NORMAL CARD
       ===================================================== */

    return (
        <Link
            to={`/post/${post.postId}`}
            className="group flex h-[520px] w-full max-w-[380px] flex-col overflow-hidden rounded-3xl border border-ink/10 bg-white/75 transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(28,26,23,.09)]"
        >

            {/* IMAGE */}

            <div className="relative h-[260px] shrink-0 overflow-hidden bg-white">

                {hasImage ? (
                    <img
                        src={imageUrl}
                        alt={post.title || ''}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => {
                            console.error(
                                'Failed to load image:',
                                imageUrl
                            )

                            e.currentTarget.style.display = 'none'
                        }}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <span className="text-4xl font-semibold text-ink/10">
                            Inkwell
                        </span>
                    </div>
                )}

                <div className="absolute left-4 top-4">

                    <span className="inline-flex rounded-full bg-white/90 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-accent">
                        {category}
                    </span>

                </div>

            </div>


            {/* CONTENT */}

            <div className="flex flex-1 flex-col overflow-hidden p-6">

                {/* DATE + READING TIME */}

                <div className="flex items-center gap-2 text-sm text-ink/50">

                    <span>
                        {date}
                    </span>

                    <span>
                        •
                    </span>

                    <span className="inline-flex items-center gap-1">

                        <Clock3 size={14} />

                        {readingTime(post.content)} min read

                    </span>

                </div>


                {/* TITLE */}

                <h3
                    className="mt-4 overflow-hidden text-2xl font-semibold leading-tight text-ink"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {post.title}
                </h3>


                {/* CONTENT */}

                <p
                    className="mt-3 overflow-hidden text-base leading-7 text-ink/60"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical'
                    }}
                >
                    {post.content}
                </p>


                {/* AUTHOR */}

                <div className="mt-auto flex items-center gap-3 border-t border-ink/10 pt-5">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                        {initials(author)}
                    </div>

                    <div className="line-clamp-1 text-sm text-ink/70">
                        {author}
                    </div>

                </div>

            </div>

        </Link>
    )
}