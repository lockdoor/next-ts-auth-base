import React from 'react'
import LayoutMain from '@/components/layouts/layoutMain'
import Jumbotron from '@/components/card/jumbotron'

export default function WaitVerify() {
  return (
    <LayoutMain page='waitVerify'>
      <Jumbotron title='Recovery Page' subTitle='Please check your email inbox to verify your account' />
    </LayoutMain>
  )
}
