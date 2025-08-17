// Client-side functions to call the AI generation API endpoints

export async function generateExcerpt(title: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'excerpt',
        title,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate excerpt');
    }

    const data = await response.json();
    return data.content;

  } catch (error) {
    console.error('Error generating excerpt:', error);
    throw new Error('Gagal membuat ringkasan dengan AI');
  }
}

export async function generateContent(title: string, excerpt: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'content',
        title,
        excerpt,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate content');
    }

    const data = await response.json();
    return data.content;

  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Gagal membuat konten dengan AI');
  }
}
