import { useState } from 'react'
import Head from 'next/head'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PostCard from '../components/PostCard'

export default function Search(){
  const [q, setQ] = useState('')
  const [results, setResults] = useState(null)
  const API = process.env.NEXT_PUBLIC_WORDPRESS_API || 'https://newsvtamil.com/wp-json/wp/v2'

  async function doSearch(e){
    e.preventDefault()
    if(!q) return
    const res = await fetch(`${API}/posts?search=${encodeURIComponent(q)}&per_page=12&_embed`)
    const posts = await res.json()
    setResults(posts)
  }

  return (
    <>
      <Head><title>Search — NewsV Tamil</title></Head>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={doSearch} className="mb-6">
          <input value={q} onChange={e=>setQ(e.target.value)} className="w-full border px-3 py-2" placeholder="Search..." />
        </form>
        {results ? (
          <div className="space-y-4">{results.map(p=> <PostCard key={p.id} post={p} />)}</div>
        ) : <div className="text-gray-600">Enter a search term to begin.</div>}
      </main>
      <Footer />
    </>
  )
}
