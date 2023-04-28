import React, {useEffect} from "react";
import Link from "next/link";
import {useRouter} from 'next/router'
type props = {
  page: string
}
export default function NavMain({page}: props) {

  // hook
  const router = useRouter()

  // function
  const addActiveLink = (id: string) => {
    const el = document.getElementById(id)
    el?.classList.add('text-green-400')
  }

  useEffect(()=>{
    switch(page){
      case 'home' : 
        addActiveLink('home')
        break
      case 'register' : 
        addActiveLink('register')
        break
      default:
        break
    }
  }, [page])
  return (
    <nav>
      
      <ul className= "flex mx-10 justify-between">
        <li >
          <Link href="/" id="home">Home</Link>
        </li>
        <li >
          <Link href={`/auth/signin?callbackUrl=${router.pathname}`} id="signin">Signin</Link>
        </li>
        <li >
          <Link href={`/auth/register?callbackUrl=${router.pathname}`} id="register">Register</Link>
        </li>
      </ul>
    </nav>
  );
}
