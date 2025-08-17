interface ArticleSuggestion {
  icon: string;
  title: string;
  type: string;
}

// Bank data for article suggestions organized by categories
const allSuggestions: ArticleSuggestion[] = [
  // How-to Articles
  {
    icon: "📝",
    title: "Cara Memilih Sistem Conveyor yang Tepat untuk Industri Anda",
    type: "How-to"
  },
  {
    icon: "⚡",
    title: "Cara Mengoptimalkan Kinerja Conveyor di Pabrik",
    type: "How-to"
  },
  {
    icon: "🔧",
    title: "Cara Merawat Conveyor agar Tahan Lama",
    type: "How-to"
  },
  {
    icon: "⚙️",
    title: "Panduan Perawatan Preventif Sistem Conveyor",
    type: "How-to"
  },
  {
    icon: "🛠️",
    title: "Cara Mengatasi Masalah Umum pada Sistem Conveyor",
    type: "How-to"
  },

  // Tips & Tricks
  {
    icon: "💡",
    title: "7 Tips Memaksimalkan Efisiensi Conveyor di Industri F&B",
    type: "Tips"
  },
  {
    icon: "💪",
    title: "5 Tips Meningkatkan Produktivitas dengan Sistem Conveyor",
    type: "Tips"
  },
  {
    icon: "🎯",
    title: "Tips Menghemat Energi pada Sistem Conveyor",
    type: "Tips"
  },
  {
    icon: "✨",
    title: "Tips Memilih Material Conveyor yang Tepat",
    type: "Tips"
  },
  {
    icon: "🌟",
    title: "Tips Mengoptimalkan Layout Conveyor di Pabrik",
    type: "Tips"
  },

  // Lists
  {
    icon: "📊",
    title: "5 Inovasi Terbaru dalam Teknologi Conveyor",
    type: "List"
  },
  {
    icon: "🎨",
    title: "10 Desain Conveyor Terpopuler untuk Industri Modern",
    type: "List"
  },
  {
    icon: "📈",
    title: "7 Tren Teknologi Conveyor di 2025",
    type: "List"
  },
  {
    icon: "🏆",
    title: "8 Keunggulan Sistem Conveyor Custom",
    type: "List"
  },
  {
    icon: "📱",
    title: "6 Teknologi Smart Conveyor untuk Industri 4.0",
    type: "List"
  },

  // Industry Specific
  {
    icon: "🏭",
    title: "Sistem Conveyor untuk Industri Manufaktur: Panduan Lengkap",
    type: "Industry"
  },
  {
    icon: "🍔",
    title: "Solusi Conveyor untuk Industri F&B",
    type: "Industry"
  },
  {
    icon: "📦",
    title: "Conveyor dalam Industri Logistik dan Pergudangan",
    type: "Industry"
  },
  {
    icon: "🛍️",
    title: "Sistem Conveyor untuk Retail Modern",
    type: "Industry"
  },
  {
    icon: "🏢",
    title: "Aplikasi Conveyor di Industri Konstruksi",
    type: "Industry"
  },

  // Maintenance & Service
  {
    icon: "🔍",
    title: "Panduan Lengkap Maintenance Conveyor",
    type: "Service"
  },
  {
    icon: "⚡",
    title: "Tips Troubleshooting Conveyor System",
    type: "Service"
  },
  {
    icon: "🛠️",
    title: "Jadwal Maintenance Conveyor yang Optimal",
    type: "Service"
  },
  {
    icon: "📋",
    title: "Checklist Perawatan Conveyor Harian",
    type: "Service"
  },
  {
    icon: "🔧",
    title: "Cara Memperpanjang Umur Pakai Conveyor",
    type: "Service"
  },

  // Technical Guides
  {
    icon: "📘",
    title: "Mengenal Jenis-jenis Belt Conveyor",
    type: "Guide"
  },
  {
    icon: "📗",
    title: "Panduan Memilih Motor Conveyor",
    type: "Guide"
  },
  {
    icon: "📙",
    title: "Sistem Kontrol Conveyor Modern",
    type: "Guide"
  },
  {
    icon: "📕",
    title: "Komponen Utama Sistem Conveyor",
    type: "Guide"
  },
  {
    icon: "📓",
    title: "Material Handling dengan Conveyor System",
    type: "Guide"
  },

  // Safety
  {
    icon: "⚠️",
    title: "Panduan Keselamatan Penggunaan Conveyor",
    type: "Safety"
  },
  {
    icon: "🛡️",
    title: "Standar Keamanan Sistem Conveyor",
    type: "Safety"
  },
  {
    icon: "🚨",
    title: "Tips Mencegah Kecelakaan pada Sistem Conveyor",
    type: "Safety"
  },
  {
    icon: "🔒",
    title: "Protokol Keselamatan Operator Conveyor",
    type: "Safety"
  },
  {
    icon: "🆘",
    title: "Penanganan Darurat pada Sistem Conveyor",
    type: "Safety"
  },

  // Innovation & Technology
  {
    icon: "🤖",
    title: "AI dalam Sistem Conveyor Modern",
    type: "Tech"
  },
  {
    icon: "📱",
    title: "IoT untuk Monitoring Conveyor",
    type: "Tech"
  },
  {
    icon: "🌐",
    title: "Integrasi Conveyor dengan Sistem ERP",
    type: "Tech"
  },
  {
    icon: "💻",
    title: "Smart Conveyor: Teknologi dan Implementasi",
    type: "Tech"
  },
  {
    icon: "🎮",
    title: "Sistem Kontrol Otomatis pada Conveyor",
    type: "Tech"
  },

  // Case Studies
  {
    icon: "📋",
    title: "Studi Kasus: Optimasi Conveyor di Industri F&B",
    type: "Case Study"
  },
  {
    icon: "📊",
    title: "Success Story: Implementasi Smart Conveyor",
    type: "Case Study"
  },
  {
    icon: "📈",
    title: "Analisis ROI Sistem Conveyor Custom",
    type: "Case Study"
  },
  {
    icon: "🏢",
    title: "Case Study: Conveyor di Industri Farmasi",
    type: "Case Study"
  },
  {
    icon: "🏭",
    title: "Transformasi Pabrik dengan Sistem Conveyor Modern",
    type: "Case Study"
  }
];

// Function to get random suggestions
export function getRandomSuggestions(count: number = 5): ArticleSuggestion[] {
  const shuffled = [...allSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export type { ArticleSuggestion };
