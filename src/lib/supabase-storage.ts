import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function uploadBlogImage(file: File) {
  try {
    const supabase = createServerComponentClient({ cookies })
    
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

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

export function getBlogImageUrl(path: string) {
  const supabase = createServerComponentClient({ cookies })
  const { data: { publicUrl } } = supabase
    .storage
    .from('blog-images')
    .getPublicUrl(path)
  
  return publicUrl
}
