import { useState, useCallback, useEffect, useRef } from 'react'
import QRCodeStyling from 'qr-code-styling'

interface Field {
  id: string
  key: string
  value: string
}

export function QRCodeComponent() {
  const BASE_URL = 'https://ton.org/transfer/'
  const [addedUrl, setAddedUrl] = useState<string>('')
  const [fields, setFields] = useState<Field[]>([
    { id: '1', key: '', value: '' },
  ])
  const qrRef = useRef<HTMLDivElement>(null)
  const qrCode = useRef<QRCodeStyling>()

  useEffect(() => {
    qrCode.current = new QRCodeStyling({
      width: 200,
      height: 200,
      type: 'svg',
      data: BASE_URL,
      dotsOptions: {
        color: '#000000',
        type: 'dots',
      },
      cornersSquareOptions: {
        color: '#000000',
        type: 'extra-rounded',
      },
      cornersDotOptions: {
        color: '#000000',
        type: 'dot',
      },
      backgroundOptions: {
        color: '#ffffff',
      },
      imageOptions: {
        crossOrigin: 'anonymous',
        margin: 0,
      },
    })

    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.current.append(qrRef.current)
    }
  }, [])

  const addField = useCallback(() => {
    setFields((prev) => [
      ...prev,
      { id: Date.now().toString(), key: '', value: '' },
    ])
  }, [])

  const removeField = useCallback((id: string) => {
    setFields((prev) => prev.filter((field) => field.id !== id))
  }, [])

  const updateField = useCallback((id: string, key: string, value: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, key, value } : field))
    )
  }, [])

  const generateQRData = useCallback(() => {
    const params = fields
      .filter((field) => field.key && field.value)
      .reduce((acc, field) => {
        acc[field.key] = field.value
        return acc
      }, {} as Record<string, string>)

    const dataString = JSON.stringify(params)
    const encodedData = btoa(dataString)
    return `${BASE_URL + addedUrl}${encodedData}`
  }, [fields, addedUrl])

  useEffect(() => {
    if (qrCode.current) {
      qrCode.current.update({
        data: generateQRData(),
      })
    }
  }, [fields, generateQRData])

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-8 h-8 text-[#31b545]'>
          <span>qr-code</span>
        </div>
        <h1 className='text-2xl font-bold'>QR Code Generator</h1>
      </div>

      <div className='bg-[#2c2c2e] rounded-xl p-6 mb-6'>
        <div className='mb-4'>
          <p className='text-sm text-gray-400 mb-2'>Base URL</p>
          <div className='bg-[#1c1c1e] p-3 rounded-lg'>
            <code className='text-[#31b545] flex items-center'>
              {BASE_URL}
              <input
                onChange={(e) => setAddedUrl(e.target.value)}
                className='bg-transparent outline-none'
                value={addedUrl}
              />
            </code>
          </div>
        </div>

        <div className='space-y-4'>
          {fields.map((field) => (
            <div key={field.id} className='flex gap-3'>
              <input
                type='text'
                placeholder='Key'
                value={field.key}
                onChange={(e) =>
                  updateField(field.id, e.target.value, field.value)
                }
                className='flex-1 bg-[#1c1c1e] rounded-lg px-4 py-2 border border-[#3c3c3e] focus:border-[#31b545] focus:outline-none'
              />
              <input
                type='text'
                placeholder='Value'
                value={field.value}
                onChange={(e) =>
                  updateField(field.id, field.key, e.target.value)
                }
                className='flex-1 bg-[#1c1c1e] rounded-lg px-4 py-2 border border-[#3c3c3e] focus:border-[#31b545] focus:outline-none'
              />
              {fields.length > 1 && (
                <button
                  onClick={() => removeField(field.id)}
                  className='p-2 hover:bg-[#3c3c3e] rounded-lg transition-colors'
                >
                  <div className='w-5 h-5 text-[#ff3b30]'>
                    <span> - </span>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addField}
          className='mt-4 flex items-center gap-2 text-[#31b545] hover:text-[#40c555] transition-colors'
        >
          <div className='w-5 h-5'> + </div>
          Add Field
        </button>
      </div>

      <div className='bg-[#2c2c2e] rounded-xl p-6 flex flex-col items-center'>
        <div className='bg-white p-4 rounded-xl mb-4'>
          <div ref={qrRef} />
        </div>
        <p className='text-sm text-gray-400'>Scan with any QR code reader</p>
      </div>
    </div>
  )
}
