import Link from 'next/link'

export default function Sidebar({posts=[]}){
  return (
    <aside>
      <div className="sidebar-widget">
        <h3 className="font-bold mb-3">Most Read</h3>
        <ul>
          {posts.slice(0,6).map(p=> (
<li key={p.id} className="mb-2">
  <Link
    href={`/${p.slug}/`}
    className="hover:text-red-600"
    dangerouslySetInnerHTML={{ __html: p.title.rendered }}
  />
</li>
          ))}
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3 className="font-bold mb-3">Labels</h3>
        <ul className="list-label">
          <li><a href="#">தமிழ்</a></li>
          <li><a href="#">தொழில்நுட்பம்</a></li>
          <li><a href="#">விளையாட்டு</a></li>
        </ul>
      </div>

      <div className="sidebar-widget">
        <h3 className="font-bold mb-3">Follow Us</h3>
        <div className="flex gap-2">
          <a className="px-3 py-2 bg-blue-600 text-white rounded">Facebook</a>
          <a className="px-3 py-2 bg-pink-500 text-white rounded">Instagram</a>
        </div>
      </div>
    </aside>
  )
}
