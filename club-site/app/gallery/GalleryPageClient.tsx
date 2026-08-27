'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ZoomIn, Info } from 'lucide-react';
import Masonry from '@/components/reactbits/Masonry';

interface GalleryItem {
  id: number;
  image: string;
  height: number;
  category: string;
  title: string;
  description: string;
}

const CATEGORIES = [
  { key: 'all', label: 'All Moments' },
  { key: 'workshops', label: 'Workshops' },
  { key: 'hackathons', label: 'Hackathons' },
  { key: 'team', label: 'Team' },
  { key: 'meetups', label: 'Meetups' },
];

const galleryData: GalleryItem[] = [
  { id: 1, image: 'https://picsum.photos/600/800?random=11', height: 800, category: 'workshops', title: 'Hands-on Coding Session', description: 'Students coding interactive React applications during our technical workshop.' },
  { id: 2, image: 'https://picsum.photos/600/500?random=12', height: 500, category: 'hackathons', title: 'InnovateX Hackathon', description: 'Teams brainstorming and building software prototypes under a 24-hour deadline.' },
  { id: 3, image: 'https://picsum.photos/600/600?random=13', height: 600, category: 'team', title: 'Core Committee Meet', description: 'Planning our event calendar and career development routines.' },
  { id: 4, image: 'https://picsum.photos/600/700?random=14', height: 700, category: 'meetups', title: 'Alumni AMA Session', description: 'Industry professionals sharing career advice and recruitment guidelines.' },
  { id: 5, image: 'https://picsum.photos/600/400?random=15', height: 400, category: 'workshops', title: 'System Design Seminar', description: 'Deep dive into scalable database architectures and microservices.' },
  { id: 6, image: 'https://picsum.photos/600/600?random=16', height: 600, category: 'hackathons', title: 'Winners Showcase', description: 'Top projects presenting their innovative ideas to a panel of expert judges.' },
  { id: 7, image: 'https://picsum.photos/600/500?random=17', height: 500, category: 'team', title: 'Place XP Orientation', description: 'Welcoming the new batch of placement enthusiasts to the community.' },
  { id: 8, image: 'https://picsum.photos/600/800?random=18', height: 800, category: 'meetups', title: 'Resume Review Camp', description: 'Mock interviews and peer resume auditing to maximize job readiness.' },
  { id: 9, image: 'https://picsum.photos/600/700?random=19', height: 700, category: 'workshops', title: 'Full Stack Bootcamp', description: 'Building and deploying web applications using next-generation tools.' },
  { id: 10, image: 'https://picsum.photos/600/450?random=20', height: 450, category: 'hackathons', title: 'Late Night Coding', description: 'Fuelled by coffee and excitement at our overnight placement-prep sprint.' },
  { id: 11, image: 'https://picsum.photos/600/550?random=21', height: 550, category: 'team', title: 'Community Retreat', description: 'A fun bonding session for members after a successful semester of events.' },
  { id: 12, image: 'https://picsum.photos/600/650?random=22', height: 650, category: 'meetups', title: 'Placement Mock Tests', description: 'Simulated online assessment rounds replicating top tier company drives.' },
];

export default function GalleryPageClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredData = useMemo(() => {
    if (activeCategory === 'all') return galleryData;
    return galleryData.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <section className="pt-36 md:pt-44 pb-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block text-sm uppercase tracking-[0.2em] text-orange-500 font-medium mb-4"
          >
            Gallery
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
          >
            Moments that <span className="text-orange-500">define us</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-text-muted mt-4 max-w-2xl text-base"
          >
            Explore snaps and memories from our workshops, hackathons, orientations, and collaborative sprints.
          </motion.p>
        </div>

        {/* Categories Tab bar */}
        <div className="flex flex-wrap gap-2 mb-10 border-b border-border-divider">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`relative px-5 py-3 text-sm font-medium transition-colors ${
                activeCategory === key ? 'text-text-primary' : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              {label}
              {activeCategory === key && (
                <motion.div
                  layoutId="gallery-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 gradient-cta"
                />
              )}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="relative">
          {filteredData.length > 0 ? (
            <div ref={containerRef} className="masonry-gallery-container">
              {/* Render interactive masonry layouts where clicking opens the details modal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredData.map((item, idx) => (
                  <motion.div
                    key={item.id}
                    layoutId={`gallery-card-${item.id}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    onClick={() => setSelectedItem(item)}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-border-default/20 bg-bg-card/20 hover:border-orange-500/30 transition-all duration-300 shadow-lg"
                  >
                    <div className="aspect-[3/4] w-full overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 via-bg-card/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" />
                      
                      {/* Floating Zoom / Info icon */}
                      <div className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ZoomIn className="w-4 h-4" />
                      </div>

                      {/* Content overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <span className="text-[10px] uppercase tracking-wider text-orange-500 font-bold bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20">
                          {item.category}
                        </span>
                        <h3 className="text-base font-bold text-text-primary tracking-tight mt-2.5">{item.title}</h3>
                        <p className="text-xs text-text-muted mt-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl py-20 text-center">
              <p className="text-text-muted">
                No memories under this category yet — check back soon.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox / Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedItem(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div
              layoutId={`gallery-card-${selectedItem.id}`}
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-bg-card rounded-2xl overflow-hidden border border-border-default/40 shadow-2xl flex flex-col md:flex-row max-h-[85vh] cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Image Frame */}
              <div className="flex-1 overflow-hidden bg-black/40 flex items-center justify-center">
                <img
                  src={selectedItem.image}
                  alt={selectedItem.title}
                  className="max-h-[50vh] md:max-h-[80vh] w-full object-contain"
                />
              </div>

              {/* Details Side-Panel */}
              <div className="w-full md:w-80 p-6 md:p-8 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border-divider bg-bg-elevated/40">
                <div className="inline-flex items-center gap-1.5 text-xs text-orange-500 font-bold uppercase tracking-wider mb-4">
                  <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  {selectedItem.category}
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-text-primary leading-tight">
                  {selectedItem.title}
                </h2>
                <p className="text-sm text-text-secondary mt-4 leading-relaxed">
                  {selectedItem.description}
                </p>
                <div className="mt-8 pt-6 border-t border-border-divider flex items-center gap-2 text-xs text-text-muted">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>Captured at official Place XP events.</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
