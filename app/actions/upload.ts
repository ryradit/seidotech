'use server'

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      throw new Error('No file provided')
    }

    const supabase = createServerActionClient({ cookies })
    
    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('blog-images')
      .getPublicUrl(data.path)

    revalidatePath('/admin/blog')
    return { url: publicUrl }
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}
