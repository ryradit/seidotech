import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest } from 'next/server';

// Initialize Gemini API
if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY is not set in environment variables');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export async function POST(req: NextRequest) {
  try {
    const { type, title, excerpt } = await req.json();

    if (type === 'excerpt') {
      const prompt = `Buatkan ringkasan singkat (maksimal 160 karakter) untuk artikel blog dengan judul: "${title}".
      Ringkasan harus:
      1. Gunakan kata "Kami" jika membahas layanan atau kemampuan perusahaan
      2. Tunjukkan expertise dan pengalaman Seido
      3. Menarik perhatian pembaca dan menjelaskan value yang mereka dapatkan
      4. Gunakan bahasa Indonesia yang profesional dan approachable
      Format: Langsung berikan ringkasannya saja tanpa kata pengantar.`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().slice(0, 160); // Ensure it doesn't exceed 160 characters

      return new Response(JSON.stringify({ content: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (type === 'content') {
      const prompt = `Buatkan konten artikel blog dengan spesifikasi berikut:

      Judul: "${title}"
      Ringkasan: "${excerpt}"
  
      Ketentuan:
      1. Tulis dalam bahasa Indonesia yang formal namun mudah dipahami
      2. SANGAT PENTING: Gunakan kata "Kami" ketika membahas layanan atau service yang ditawarkan. Contoh: "Kami menyediakan layanan...", "Layanan yang kami berikan...", "Tim teknisi kami..."
      3. Bagi menjadi beberapa bagian dengan subheading yang relevan
      4. Setiap bagian minimal 2-3 paragraf
      5. Masukkan poin-poin penting dan tips praktis
      6. Fokus pada industri manufaktur dan sistem conveyor
      7. Berikan contoh konkret dari pengalaman dan proyek kami
      8. Tunjukkan expertise dan pengalaman Seido dalam industri
      9. Akhiri dengan kesimpulan dan call-to-action untuk menghubungi kami
  
      Format:
      - JANGAN GUNAKAN TANDA BINTANG (*) atau UNDERSCORE (_) untuk formatting
      - Gunakan ## untuk subheading saja
      - Buat paragraf yang mudah dibaca
      - Gunakan penomoran 1. 2. 3. untuk list
      - Gunakan - untuk bullet points`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      let text = response.text();
      
      // Clean up any remaining asterisks or markdown emphasis
      text = text.replace(/\*\*/g, ''); // Remove double asterisks
      text = text.replace(/\*/g, '');    // Remove single asterisks
      text = text.replace(/__/g, '');    // Remove double underscores
      text = text.replace(/_/g, '');     // Remove single underscores

      return new Response(JSON.stringify({ content: text }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response('Invalid type specified', { status: 400 });
  } catch (error) {
    console.error('Error generating content:', error);
    return new Response('Error generating content', { status: 500 });
  }
}
