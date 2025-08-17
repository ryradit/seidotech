import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { StorageError } from '@supabase/storage-js'

// Remove edge runtime to ensure cookie handling works properly
export async function POST(request: Request) {
  // Initialize Supabase client once
  const supabase = createRouteHandlerClient({ cookies })
  
  try {
    // Check if user is authenticated
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, WebP and GIF images are allowed.' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      )
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('blog-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type // Explicitly set content type
      })

    if (error) {
      console.error('Supabase storage error:', error)
      return NextResponse.json(
        { error: error.message || 'Error uploading file to storage' },
        { status: 500 }
      )
    }

    // Get the public URL
    const { data: { publicUrl } } = supabase
      .storage
      .from('blog-images')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: publicUrl })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: error.message || 'Error uploading file' },
      { status: 500 }
    )
  }
}
