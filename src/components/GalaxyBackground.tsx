import { motion } from 'framer-motion';

export function GalaxyBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#050505] pointer-events-none">
      {/* Static Galaxy Image Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1200&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: 'translateZ(0)'
        }}
      />
      
      {/* Gradient Overlays to make text readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90" />
    </div>
  );
}
