import React from 'react'
import Loading from '../layouts/loading'

type props = {
  disabled: boolean
}

export default function SubmitBtn({ disabled }: props) {
  return (
    <button 
      disabled={disabled}
      type='submit' 
      className='block mx-auto border border-blue-400 rounded-md py-2 px-10 text-blue-400 hover:bg-blue-400 hover:text-white'
      >{disabled  ? 'Waiting...': 'Submit'}</button>
  )
}
