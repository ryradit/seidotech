
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Mitra {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
}

const ScrollingPartners = ({ mitras }: { mitras: Mitra[] }) => {
    // Duplikasi array untuk menciptakan efek loop yang mulus
    const duplicatedMitras = [...mitras, ...mitras];
    return (
        <>
            {duplicatedMitras.map((mitra, index) => (
                <div key={`${mitra.id}-${index}`} className="flex-shrink-0" aria-hidden={index >= mitras.length}>
                    <p className="text-sm font-medium text-center text-muted-foreground whitespace-nowrap">{mitra.name}</p>
                </div>
            ))}
        </>
    );
};

export function MitraSection() {
  const [mitras, setMitras] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMitras = async (retryCount = 0) => {
      try {
        const { data, error } = await supabase
          .from('mitras')
          .select('*')
          .order('createdAt', { ascending: false });
        
        if (error) {
          if (retryCount < 3) {
            console.log(`Retry attempt ${retryCount + 1} for fetching mitras...`);
            setTimeout(() => fetchMitras(retryCount + 1), 1000 * (retryCount + 1));
            return;
          }
          throw error;
        }
        
        setMitras(data || []);
      } catch (error) {
        console.error('Error fetching mitras:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMitras();
  }, []);

  if (loading) {
    return (
      <section id="mitra" className="w-full py-8 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Dipercaya oleh Perusahaan Terkemuka</h2>
            <div className="w-full overflow-hidden relative group scrolling-wrapper">
               <div className="flex space-x-16 justify-center">
                  <p className="text-sm text-muted-foreground">Memuat data mitra...</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (mitras.length === 0) {
    return (
      <section id="mitra" className="w-full py-8 bg-secondary">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Dipercaya oleh Perusahaan Terkemuka</h2>
            <div className="w-full overflow-hidden relative group scrolling-wrapper">
               <div className="flex space-x-16 justify-center">
                  <p className="text-sm text-muted-foreground">Belum ada data mitra</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="mitra" className="w-full py-8 bg-secondary">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <h2 className="text-xl font-semibold tracking-tight text-muted-foreground">Dipercaya oleh Perusahaan Terkemuka</h2>
          <div className="w-full overflow-hidden relative group scrolling-wrapper">
             <div className="flex space-x-16 scrolling-content">
                <ScrollingPartners mitras={mitras} />
             </div>
             <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-secondary to-transparent"></div>
             <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-secondary to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
