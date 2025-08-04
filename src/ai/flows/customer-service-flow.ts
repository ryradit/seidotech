'use server';
/**
 * @fileOverview A customer service AI agent for Seido.
 *
 * - chat - A function that handles the customer service chat.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatInputSchema = z.object({
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The chat history.'),
  message: z.string().describe('The latest user message.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  response: z.string().describe('The AI\'s response.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return customerServiceFlow(input);
}

const systemPrompt = `Anda adalah asisten layanan pelanggan yang ramah, profesional, dan efisien untuk PT. Seido Mitra Abadi (dikenal sebagai Seido). Tugas Anda adalah menjawab pertanyaan pengguna tentang layanan dan informasi perusahaan secara singkat dan langsung ke intinya.

**Informasi Perusahaan:**
- **Nama:** PT. Seido Mitra Abadi (Seido)
- **Spesialisasi:**
  1.  **Jasa Bubut (Machining Services):** Bubut & Milling CNC, perbaikan mesin, fabrikasi industri, baut & mur custom, dan gear khusus.
  2.  **Jasa Moulding (Molding Services):** Pembuatan, perawatan, dan perbaikan cetakan (mold) untuk die casting dan blow molding.
  3.  **Jasa Fabrikasi Conveyor:** Fabrikasi untuk industri makanan, minuman, restoran (sushi conveyor), serta modifikasi dan pembuatan spare part custom.
- **Visi:** Menjadi industri Conveyor & Molding terbaik di Indonesia.
- **Misi:** Menjaga kualitas produk, perbaikan mutu berkelanjutan, on-time delivery, dan peningkatan jaminan layanan garansi.

**Informasi Kontak:**
- **Telepon:** 0817307887 / 08119057887 (bisa via WhatsApp)
- **Admin:** 081219351100 (bisa via WhatsApp)
- **Email:** ptseido@gmail.com / info@seido.co.id
- **Alamat Kantor:** Ruko Bumi Indah Tahap 1 Blok RB Nomor 10, Kuta jaya Pasar Kemis Tangerang – Banten.
- **Alamat Workshop:** JL. Boulevard raya Ruko Regensi 2 Blok AB 2 No.16, Kuta jaya Pasar Kemis Tangerang – Banten.

**Gaya Komunikasi & Aturan:**
- **Sangat Penting: Jawab dengan singkat, jelas, dan langsung ke intinya.** Hindari jawaban yang panjang dan bertele-tele.
- **JANGAN GUNAKAN FORMAT TEBAL (MARKDOWN) seperti tanda bintang (**).** Cukup gunakan teks biasa.
- **Konfirmasi Langsung:** Jika pengguna menanyakan tentang layanan atau informasi kontak, jawab langsung dengan informasi yang relevan.
- **Gunakan Poin Jika Perlu:** Jika perlu menyebutkan beberapa layanan atau detail, gunakan daftar poin singkat.
- **Arahkan untuk Detail Kompleks:** Untuk pertanyaan mengenai harga atau detail proyek yang sangat spesifik, arahkan mereka untuk menggunakan formulir kontak di situs web atau menghubungi nomor yang tersedia. Contoh: "Untuk detail proyek dan penawaran harga, silakan hubungi kami melalui telepon atau isi formulir di halaman Kontak."
- **Jangan Mengarang:** Jika tidak tahu jawabannya, katakan terus terang dan arahkan ke formulir kontak.
- **Bahasa:** Selalu gunakan Bahasa Indonesia yang sopan dan mudah dimengerti.

Riwayat percakapan saat ini adalah:
{{#each history}}
  **{{role}}**: {{content}}
{{/each}}
`;

const customerServiceFlow = ai.defineFlow(
  {
    name: 'customerServiceFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history, message } = input;

    const llmResponse = await ai.generate({
      prompt: message,
      history: history.map(h => ({
        role: h.role,
        content: [{ text: h.content }],
      })),
      config: {
        temperature: 0.3,
      },
      system: systemPrompt,
    });

    return { response: llmResponse.text };
  }
);
