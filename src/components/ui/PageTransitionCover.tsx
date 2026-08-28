import { motion, AnimatePresence } from 'framer-motion';

interface PageTransitionCoverProps {
  isVisible: boolean;
}

export function PageTransitionCover({ isVisible }: PageTransitionCoverProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] origin-top bg-[#F4E4BC] flex items-center justify-center overflow-hidden"
          style={{
            backgroundImage: 'url("https://www.transparenttextures.com/patterns/aged-paper.png")',
            borderBottom: '8px solid #3E2723',
            boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
          }}
        >
          {/* Decorative medieval emblem in the center */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-[#3E2723] flex items-center justify-center shadow-2xl relative"
            style={{
              background: 'radial-gradient(circle, #8D6E63 0%, #3E2723 100%)'
            }}
          >
            {/* Wax seal effect or icon could go here */}
            <div className="text-[#F4E4BC] font-display font-black text-4xl md:text-6xl uppercase tracking-widest drop-shadow-md">
              F
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
