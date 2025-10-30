import Head from 'next/head'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export async function getStaticPaths(){
  const API = process.env.NEXT_PUBLIC_WORDPRESS_API || 'https://newsvtamil.com/wp-json/wp/v2'
  const res = await fetch(`${API}/posts?per_page=10`)
  const posts = await res.json()
  const paths = posts.map(p=>({ params: { id: p.id.toString() } }))
  return { paths, fallback: 'blocking' }
}

export async function getStaticProps({ params }){
  const API = process.env.NEXT_PUBLIC_WORDPRESS_API || 'https://newsvtamil.com/wp-json/wp/v2'
  try{
    const res = await fetch(`${API}/posts/${params.id}?_embed`)
    const post = await res.json()
    return { props: { post }, revalidate: 60 }
  }catch(e){
    return { notFound: true }
  }
}

export default function Post({ post }){
  if(!post) return <div>Loading...</div>
  return (
    <>
      <Head>
        <title>{post.title.rendered.replace(/<[^>]+>/g,'')} | Tamizhakam</title>
      </Head>
      <Header />
      <article className="container site-inner py-6">
        <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{__html: post.title.rendered}} />
        <p className="text-sm text-gray-500 mb-4">{new Date(post.date).toLocaleDateString('en-IN')}</p>
        {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
          <img src={post._embedded['wp:featuredmedia'][0].source_url} alt="" className="w-full h-64 object-cover rounded mb-4" />
        )}
        <div className="prose" dangerouslySetInnerHTML={{__html: post.content.rendered}} />
      </article>
      <Footer />
    </>
  )
}
