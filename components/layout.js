import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'

export default function Layout({ children }) {
  const [showingMenuList, setShowingMenuList] = useState(false)
  const menuListRef = useRef(null)

  useEffect(() => {
    const checkIfClickedOutside = (event) => {
      if (showingMenuList && menuListRef.current && !menuListRef.current.contains(event.target)) {
        setShowingMenuList(false)
      }
    }
    window.addEventListener('mousedown', checkIfClickedOutside);
    return () => window.removeEventListener('mousedown', checkIfClickedOutside)
  }, [showingMenuList])

  return (
    <div className="container px-3 mx-auto sm:max-w-sm">
      <header className="flex flex-row items-center mt-3">
        <div className="basis-1/4"><Link href="/"><img className="w-8" src="/images/logo.png"/></Link></div>
        <div className="basis-2/4 font-bold text-2xl text-center"><span>THETA PIZZA</span></div>
        <div className="basis-1/4 text-right">
          <div className="relative inline-block text-left">
            <div><img className="w-7" src="/images/list.svg" onClick={ () => setShowingMenuList(!showingMenuList) }/></div>
            <div ref={menuListRef} id="menuList" style={{ display: (showingMenuList ? 'block' : 'none') }} className="absolute right-0 z-10 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Link href="/transactions" className="text-gray-700 block px-4 py-1 text-md" onClick={ () => setShowingMenuList(false) }>Transactions</Link>
                <Link href="/validators" className="text-gray-700 block px-4 py-1 text-md" onClick={ () => setShowingMenuList(false) }>Validators</Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer></footer>
    </div>
  )
}