'use client'

import Logger from '@/lib/logger'
import { validateUrl } from '@/lib/validate-url'
import axios from 'axios'
import { SetStateAction, useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import useAxios from 'axios-hooks'
type ShortUrlData = {
  id?: string
}

export default function Home () {
  const [id, setId] = useState(null)
  const [userCustomer, setUserCustomer] = useState('')
  const [tel, setTel] = useState('')
  const [shortUrlData, setShortUrlData] = useState([])

  const [{ data }, refetch] = useAxios('/api/customer', {
    autoCancel: false,
    ssr: true,
    useCache: false,
    manual: true
  })

  useEffect(() => {
    refetch()
  }, [])

  const handleInputUserCustomer = (e: {
    target: { value: SetStateAction<string> }
  }) => setUserCustomer(e.target.value)

  const handleInputTel = (e: { target: { value: SetStateAction<string> } }) =>
    setTel(e.target.value)

  const handleGenerateShortUrl = async (origUrl: string) => {
    if (!validateUrl(origUrl)) {
      return
    }

    try {
      await axios({
        method: 'post',
        url: '/api/short-url',
        data: {
          origUrl
        }
      })
    } catch (error) {
      Logger(`Error generating short url: ${error}`)
    }
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()

    Swal.fire({
      title: 'Please Wait !',
      html: 'data uploading',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      const customer = await axios({
        method: 'post',
        url: '/api/customer',
        data: {
          id,
          userCustomer,
          tel
        }
      })
      const agents = await axios({
        method: 'get',
        url: '/api/agent'
      })
      for (const { idAgent } of agents.data.result) {
        await axios({
          method: 'post',
          url: '/api/short-url',
          data: {
            origUrl: `https://www.ufaposeidon99.com/?ag=${idAgent}&recommend=${userCustomer}`,
            customerId: customer.data.result.id
          }
        })
      }
      refetch()
      handleClearInputs()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Customer created or update successfully!'
      })
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!'
      })
    }
  }

  const handleClearInputs = () => {
    setId(null)
    setUserCustomer('')
    setTel('')
    setShortUrlData([])
  }

  const handleSelectData = async (e: any) => {
    setId(e.id)
    setUserCustomer(e.userCustomer)
    setTel(e.tel)
    setShortUrlData(e.urls)
  }

  const HEADER = ['no', 'user Customer', 'tel']
  const HEADER_LINK = ['no', 'click', 'Short Url', 'Orig Url']

  return (
    <div className='md:container md:mx-auto'>
      <form onSubmit={handleSubmit}>
        <div className='space-y-12'>
          <div className='border-b border-gray-900/10 pb-12 pt-6'>
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Customer Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Use a permanent address where you can receive mail.
            </p>

            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='user-customer'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  User Customer
                </label>
                <div className='mt-2'>
                  <input
                    value={userCustomer}
                    onChange={handleInputUserCustomer}
                    type='text'
                    name='user-customer'
                    id='user-customer'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>

              <div className='sm:col-span-2'>
                <label
                  htmlFor='tel'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Tel
                </label>
                <div className='mt-2'>
                  <input
                    value={tel}
                    onChange={handleInputTel}
                    type='text'
                    name='tel'
                    id='tel'
                    autoComplete='tel'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
            
            <div className='mt-10 rounded-3xl overflow-hidden shadow-lg bg-white mb-10'>
              <div className='overflow-x-auto'>
                <table className='table table-zebra'>
                  <thead>
                    <tr>
                      {HEADER_LINK.map(_ => (
                        <th
                          key={_}
                          className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {_}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {shortUrlData?.map(
                      ({ clicks, origUrl, shortUrl }, index) => (
                        <tr key={index} className='cursor-pointer'>
                          <th className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                            {index + 1}
                          </th>
                          <td className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider'>
                            {clicks}
                          </td>
                          <td className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider'>
                            {origUrl}
                          </td>
                          <td className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider'>
                            {shortUrl}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                  <tfoot>
                    <tr>
                      {HEADER_LINK.map(_ => (
                        <th
                          key={_}
                          className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'
                        >
                          {_}
                        </th>
                      ))}
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-6 flex items-center justify-end gap-x-6 pb-6'>
          <button
            onClick={handleClearInputs}
            type='button'
            className='text-sm font-semibold leading-6 text-gray-900'
          >
            Reset
          </button>
          <button
            type='submit'
            className='rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          >
            Save
          </button>
        </div>
      </form>

      <div className='rounded-3xl overflow-hidden shadow-lg bg-white mb-10'>
        <div className='overflow-x-auto'>
          <table className='table table-zebra'>
            <thead>
              <tr>
                {HEADER.map(_ => (
                  <th
                    key={_}
                    className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {_}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data?.result?.map((_e: any, index: number) => (
                <tr
                  key={index}
                  onClick={() => handleSelectData(_e)}
                  className='cursor-pointer'
                >
                  <th className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'>
                    {index + 1}
                  </th>
                  <td className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider'>
                    {_e?.userCustomer}
                  </td>
                  <td className='px-6 py-3 border-b border-gray-200 text-left text-xs leading-4 font-medium text-gray-900 uppercase tracking-wider'>
                    {_e?.tel}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                {HEADER.map(_ => (
                  <th
                    key={_}
                    className='px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider'
                  >
                    {_}
                  </th>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
