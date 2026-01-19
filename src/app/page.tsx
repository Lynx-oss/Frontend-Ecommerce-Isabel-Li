import HeroBanner from './components/home/HeroBanner';
import PromoBar from './components/home/PromoBar';
import FeaturedProducts from './components/home/FeaturedProducts';
import CategoryGrid from './components/home/CategoryGrid';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <PromoBar />
      
      <FeaturedProducts 
        title="Nueva Colección" 
        subtitle="NOVEDADES" 
      />
      
      <CategoryGrid />
      
      <FeaturedProducts 
        title="Todos los Productos" 
        subtitle="DESCUBRÍ MÁS" 
      />

      <section className="py-16 md:py-24 bg-stone-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-amber-700 text-xs tracking-[0.3em] mb-2 block">SÍGUENOS</span>
          <h2 className="font-serif text-3xl md:text-4xl tracking-wide mb-4">@isabel.li</h2>
          <p className="text-stone-600 mb-8">Compartí tu look y etiquetanos</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=400&fit=crop',
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&h=400&fit=crop',
            ].map((img, i) => (
              <a
                key={i}
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden"
              >
                <img 
                  src={img} 
                  alt={`Instagram ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/30 transition-colors duration-300" />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}