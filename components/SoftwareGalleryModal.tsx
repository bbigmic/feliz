"use client"

import { useState } from "react"

interface SoftwareGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  images: { url: string }[]
}

export default function SoftwareGalleryModal({ isOpen, onClose, images }: SoftwareGalleryModalProps) {
  const [current, setCurrent] = useState(0)
  if (!isOpen || !images || images.length === 0) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-90">
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <button className="absolute top-3 right-3 sm:top-6 sm:right-8 text-gray-400 hover:text-white text-2xl sm:text-3xl z-10" onClick={onClose}>✕</button>
        <div className="flex items-center justify-center w-full h-[60vh] sm:h-[85vh] px-1 sm:px-0">
          <button onClick={prev} className="text-3xl sm:text-5xl px-2 sm:px-6 text-gray-400 hover:text-white hidden xs:block">&#8592;</button>
          <img src={images[current].url} alt="galeria" className="max-h-[50vh] sm:max-h-[80vh] w-auto max-w-full sm:max-w-5xl rounded-lg object-contain mx-1 sm:mx-4 shadow-2xl border-4 border-gray-800" />
          <button onClick={next} className="text-3xl sm:text-5xl px-2 sm:px-6 text-gray-400 hover:text-white hidden xs:block">&#8594;</button>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-10 justify-center overflow-x-auto w-full px-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
          {images.map((img, idx) => (
            <img
              key={img.url}
              src={img.url}
              alt="miniatura"
              className={`w-20 h-20 sm:w-28 sm:h-28 object-cover rounded-lg border-2 cursor-pointer flex-shrink-0 ${idx === current ? 'border-primary-500' : 'border-gray-700'}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
        {/* Mobilne strzałki pod zdjęciem */}
        <div className="flex justify-center items-center gap-8 mt-4 sm:hidden">
          <button onClick={prev} className="text-3xl px-4 text-gray-400 hover:text-white">&#8592;</button>
          <button onClick={next} className="text-3xl px-4 text-gray-400 hover:text-white">&#8594;</button>
        </div>
      </div>
    </div>
  )
} 