import React from 'react'
import { Metadata } from 'next'


export const metadata: Metadata = {
    title: `${process.env.APP_NAME} - Open Account`,
    description: `${process.env.APP_DESCRIPTION}`,
}

export default function layout({ children }) {
  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        
      {children}
    </div>
  )
}
