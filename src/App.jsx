import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import NeuralNetwork from './components/NeuralNetwork'
import FluidBackground from './components/FluidBackground'

const headlineLines = [
  'We Engineer',
  'Attention,',
  'Emotion,',
  'Action.'
]

function useScrollEffects() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const p = Math.min(1, window.scrollY / window.innerHeight)
      setProgress(p)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function DataTicker() {
  const items = [
    'Currently accepting 3 clients this quarter',
    '127% average conversion lift',
    '50+ brands transformed'
  ]
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 2200)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mt-10 h-6 overflow-hidden" aria-live="polite">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.45 }}
          className="font-['Space Mono',monospace] text-[14px] text-[#2C5F4D]"
        >
          {items[index]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ScrollIndicator() {
  const [visible, setVisible] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 3000)
    const onScroll = () => setVisible(false)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { clearTimeout(t); window.removeEventListener('scroll', onScroll) }
  }, [])
  if (!visible) return null
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-10 flex flex-col items-center text-white/70">
      <div className="text-xs mb-3 tracking-wide">Scroll to see psychology in action</div>
      <div className="relative h-16 w-px bg-[#2C5F4D]/80">
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-[#2C5F4D] animate-pulse" />
      </div>
    </div>
  )
}

export default function App() {
  const progress = useScrollEffects()

  return (
    <div className="min-h-[200vh] bg-[#0B0B0B] text-white relative overflow-x-hidden">
      <FluidBackground />

      <div className="absolute right-0 top-0 h-screen w-[60vw]" style={{ transform: `translateY(${(-150 * progress)}px) scale(${1 - progress * 0.3})`, transformOrigin: 'center' }}>
        <NeuralNetwork />
      </div>

      <main className="relative z-10 container mx-auto px-8 sm:px-12 lg:px-16">
        <section className="min-h-screen flex items-center" style={{ paddingTop: '12vh', paddingBottom: '12vh' }}>
          <div className="w-full grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-6 lg:col-span-5 flex flex-col justify-center" style={{ transform: `scale(${1 - progress * 0.15})`, opacity: `${1 - progress * 0.7}` }}>
              <div className="leading-tight tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {headlineLines.map((line, i) => (
                  <motion.h1
                    key={i}
                    initial={{ opacity: 0, filter: 'blur(8px)', y: 12 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    transition={{ delay: i * 0.8, duration: 0.9, ease: 'easeOut' }}
                    className="font-[\'Playfair Display\',serif] text-[48px] sm:text-[64px] text-white"
                  >
                    {line}
                  </motion.h1>
                ))}
              </div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: headlineLines.length * 0.8 + 1.2, duration: 0.6 }}
                className="mt-6 text-[18px] text-[#999999] max-w-[60ch]"
              >
                Psychology-driven design for brands that demand measurable results.
              </motion.p>

              <DataTicker />

              <motion.a
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: headlineLines.length * 0.8 + 1.6, duration: 0.6 }}
                href="#framework"
                className="inline-block mt-14 bg-[#2C5F4D] text-white text-[16px] font-medium px-9 py-4 rounded-[4px] shadow-[0_8px_24px_rgba(44,95,77,0.3)] hover:-translate-y-1 transition-all duration-300"
              >
                Explore The Framework →
              </motion.a>
            </div>
          </div>
        </section>

        <ScrollIndicator />

        <section id="framework" className="min-h-screen flex items-center">
          <div className="text-white/70">More sections coming next…</div>
        </section>
      </main>
    </div>
  )
}
