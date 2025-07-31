"use client"

import { useState, useEffect } from "react"
import toast from "react-hot-toast"

interface SoftwareFormModalProps {
  isOpen: boolean
  onClose: () => void
  onAdded: () => void
  softwareToEdit?: any // jeśli przekazane, tryb edycji
}

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || ''
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || ''
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || ''

async function uploadToCloudinary(file: File): Promise<string | null> {
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
  const timestamp = Math.floor(Date.now() / 1000);
  // Tworzymy signature na backendzie, więc tu tylko upload przez preset lub przez backend
  // Jeśli nie masz unsigned preset, musisz zrobić upload przez backend!
  // Tu fallback na upload preset, jeśli istnieje
  const formData = new FormData();
  formData.append('file', file);
  if (process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
  } else {
    // Jeśli nie masz unsigned preset, musisz zrobić upload przez backend!
    alert('Brak upload_preset! Skonfiguruj unsigned upload preset w Cloudinary lub zrób upload przez backend.');
    return null;
  }
  const res = await fetch(url, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  return data.secure_url || null;
}

export default function SoftwareFormModal({ isOpen, onClose, onAdded, softwareToEdit }: SoftwareFormModalProps) {
  const [name, setName] = useState(softwareToEdit?.name || "")
  const [description, setDescription] = useState(softwareToEdit?.description || "")
  const [price, setPrice] = useState(softwareToEdit?.price || 0)
  const [categoriesInput, setCategoriesInput] = useState(softwareToEdit?.categories ? JSON.parse(softwareToEdit.categories).join(', ') : "")
  const [demoUrl, setDemoUrl] = useState(softwareToEdit?.demoUrl || "")
  const [features, setFeatures] = useState<string[]>(softwareToEdit?.features ? JSON.parse(softwareToEdit.features) : [])
  const [featureInput, setFeatureInput] = useState("")
  const [rating, setRating] = useState(softwareToEdit?.rating || 5)
  const [sales, setSales] = useState(softwareToEdit?.sales || 0)
  const [status, setStatus] = useState(softwareToEdit?.status || "active")
  const [images, setImages] = useState<string[]>(softwareToEdit?.images ? softwareToEdit.images.map((img: any) => img.url) : [])
  const [thumbnailIdx, setThumbnailIdx] = useState<number>(softwareToEdit?.images ? softwareToEdit.images.findIndex((img: any) => img.isThumbnail) : 0)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (softwareToEdit) {
      setName(softwareToEdit.name || "")
      setDescription(softwareToEdit.description || "")
      setPrice(softwareToEdit.price || 0)
      setCategoriesInput(softwareToEdit.categories ? JSON.parse(softwareToEdit.categories).join(', ') : "")
      setDemoUrl(softwareToEdit.demoUrl || "")
      setFeatures(softwareToEdit.features ? JSON.parse(softwareToEdit.features) : [])
      setRating(softwareToEdit.rating || 5)
      setSales(softwareToEdit.sales || 0)
      setStatus(softwareToEdit.status || "active")
      setImages(softwareToEdit.images ? softwareToEdit.images.map((img: any) => img.url) : [])
      setThumbnailIdx(softwareToEdit.images ? softwareToEdit.images.findIndex((img: any) => img.isThumbnail) : 0)
    }
  }, [softwareToEdit])

  if (!isOpen) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    setUploading(true)
    const uploaded: string[] = []
    for (let i = 0; i < files.length; i++) {
      const formData = new FormData()
      formData.append('file', files[i])
      const res = await fetch('/api/admin/upload-image', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()
      if (data.url) uploaded.push(data.url)
      else toast.error('Błąd uploadu zdjęcia!')
    }
    setImages(prev => [...prev, ...uploaded])
    setUploading(false)
    // Po uploadzie, jeśli nie ma miniaturki, ustaw pierwsze zdjęcie jako miniaturkę
    setThumbnailIdx(0)
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const missing: string[] = []
    if (!name) missing.push('nazwa')
    if (!description) missing.push('opis')
    if (!categoriesInput) missing.push('kategorie')
    if (!demoUrl) missing.push('demoUrl')
    // UWAGA: zdjęcia mogą być puste
    if (missing.length > 0) {
      console.error('Brakujące pola:', missing)
      toast.error(`Uzupełnij: ${missing.join(', ')}`)
      return
    }
    const categories = JSON.stringify(categoriesInput.split(',').map((s: string) => s.trim()).filter(Boolean))
    const payload = {
      name,
      description,
      price,
      categories,
      demoUrl,
      features: JSON.stringify(features),
      rating,
      sales,
      status,
      images,
      thumbnailIdx
    }
    let res
    if (softwareToEdit) {
      // PATCH z pełnym obiektem
      res = await fetch(`/api/admin/softwares?id=${softwareToEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    } else {
      res = await fetch("/api/admin/softwares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    }
    if (res.ok) {
      toast.success(softwareToEdit ? "Oprogramowanie zaktualizowane!" : "Oprogramowanie dodane!")
      onAdded()
      onClose()
      if (!softwareToEdit) {
        setName(""); setDescription(""); setPrice(0); setCategoriesInput(""); setDemoUrl(""); setFeatures([]); setFeatureInput(""); setRating(5); setSales(0); setStatus("active"); setImages([]); setThumbnailIdx(0)
      }
    } else {
      toast.error("Błąd przy zapisie oprogramowania!")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
      <div className="bg-darkpanel rounded-xl shadow-lg p-8 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={onClose}
          disabled={uploading}
        >✕</button>
        <h2 className="text-2xl font-bold mb-4 text-center text-darktext">Dodaj oprogramowanie</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nazwa" className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={name} onChange={e => setName(e.target.value)} required disabled={uploading} />
          <textarea placeholder="Opis" className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={description} onChange={e => setDescription(e.target.value)} required disabled={uploading} />
          <input type="number" placeholder="Cena" className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={price} onChange={e => setPrice(Number(e.target.value))} required disabled={uploading} />
          <input type="text" placeholder="Kategorie (oddziel przecinkiem)" className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={categoriesInput} onChange={e => setCategoriesInput(e.target.value)} required disabled={uploading} />
          <input type="url" placeholder="Demo URL" className="w-full p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={demoUrl} onChange={e => setDemoUrl(e.target.value)} required disabled={uploading} />
          <div className="flex gap-2">
            <input type="text" placeholder="Dodaj cechę" className="flex-1 p-2 rounded bg-darkbg border border-gray-700 text-darktext" value={featureInput} onChange={e => setFeatureInput(e.target.value)} disabled={uploading} />
            <button type="button" className="btn-secondary" onClick={handleAddFeature} disabled={uploading}>Dodaj</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {features.map((f, i) => (
              <span key={i} className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs">{f}</span>
            ))}
          </div>
          <div>
            <label className="block mb-2 text-darksubtle">Zdjęcia (Cloudinary):</label>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            <div className="flex flex-wrap gap-2 mt-2">
              {images.map((img, idx) => (
                <div key={img} className={`relative border-2 rounded-lg ${thumbnailIdx === idx ? 'border-primary-500' : 'border-gray-700'}`}>
                  <img src={img} alt="miniatura" className="w-20 h-20 object-cover rounded-lg" />
                  <button type="button" className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-1 text-xs" onClick={() => {
                    setImages(images.filter((_, i) => i !== idx))
                    // Jeśli usuwasz miniaturkę, ustaw nową miniaturkę na 0
                    if (thumbnailIdx === idx) setThumbnailIdx(0)
                    else if (thumbnailIdx > idx) setThumbnailIdx(thumbnailIdx - 1)
                  }}>&times;</button>
                  <button type="button" className={`absolute bottom-1 left-1 rounded-full px-2 text-xs ${thumbnailIdx === idx ? 'bg-primary-600 text-white' : 'bg-gray-700 text-gray-200'}`} onClick={() => setThumbnailIdx(idx)}>{thumbnailIdx === idx ? 'Miniaturka' : 'Ustaw jako miniaturkę'}</button>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={uploading}>{uploading ? 'Ładowanie...' : 'Dodaj oprogramowanie'}</button>
        </form>
      </div>
    </div>
  )
} 