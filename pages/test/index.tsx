import React from 'react'
import Jumbotron from '@/components/card/jumbotron'
import LayoutMain from '@/components/layouts/layoutMain'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Index() {

  // hook
  const router = useRouter()

  return (
    <LayoutMain page="home">
      <Jumbotron title='Home Page' subTitle='This Page is in construction' />
      <Link href={`/auth/signin?callbackUrl=${router.pathname}`}>signin</Link>
    </LayoutMain>
    
  )
}

