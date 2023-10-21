'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import Swal from 'sweetalert2'
import { useRouter } from 'next/navigation'

function LoginPage () {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [emailInPutError, setEmailInputError] = useState(false)
  const [passwordInPutError, setPasswordInputError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit (e: { preventDefault: () => void }) {
    e.preventDefault()
    Swal.fire({
      title: 'Loading...',
      text: 'Please wait...',
      icon: 'info',
      showConfirmButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false
    })
    try {
      let res = await signIn('credentials', {
        email,
        password,
        callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
        redirect: false
      })

      Swal.close()

      if (res?.ok) {
        return router.push('/')
      }

      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'email or password is incorrect'
      })

    } catch (error) {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'email or password is incorrect'
      })
    }
  }

  return (
    <>
      <div
        className='w-100 p-5 overflow-x-auto'
        style={{ padding: '0px !important' }}
      >
        <div className='min-h-screen text-gray-900 flex justify-center'>
          <div className='max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1'>
            <div className='lg:w-1/2 xl:w-5/12 p-6 sm:p-12'>
              <div>
                {/* <img src="/baner.png"
          className="w-32 mx-auto" /> */}
              </div>
              <div className='mt-12 flex flex-col items-center'>
                <h1 className='text-2xl xl:text-3xl font-extrabold'>
                  ลงชื่อเข้าใช้งาน
                </h1>

                <form className='w-full' onSubmit={handleSubmit}>
                  <div className='w-full flex-1 mt-8'>
                    <div className='mx-auto max-w-xs'>
                      <input
                        id='email'
                        type='text'
                        placeholder='Email'
                        onChange={e => {
                          setEmail(e.target.value)
                        }}
                        className={`border-${
                          emailInPutError ? 'red-500' : ''
                        } w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                      />
                      <input
                        className={`border-${
                          emailInPutError ? 'red-500' : ''
                        } w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5`}
                        id='password'
                        type='password'
                        placeholder='******************'
                        onChange={e => {
                          setPassword(e.target.value)
                        }}
                      />
                      <button className='mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none'>
                        <svg
                          className='w-6 h-6 -ml-2'
                          fill='none'
                          stroke='currentColor'
                          strokeWidth='2'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        >
                          <path d='M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2' />
                          <circle cx='8.5' cy='7' r='4' />
                          <path d='M20 8v6M23 11h-6' />
                        </svg>
                        <span className='ml-3'>ลงชื่อเข้าใช้งาน</span>
                      </button>
                      <p className='mt-6 text-xs text-gray-600 text-center'>
                        I agree to abide by Warayut Tekrathok (Chun)
                        <a
                          href='#'
                          className='border-b border-gray-500 border-dotted'
                        >
                          Terms of Service
                        </a>
                        and its
                        <a
                          href='#'
                          className='border-b border-gray-500 border-dotted'
                        >
                          Privacy Policy
                        </a>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className='flex-1 bg-indigo-100 text-center hidden lg:flex'>
              <div
                className='m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat'
                style={{
                  backgroundImage:
                    "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')"
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage
