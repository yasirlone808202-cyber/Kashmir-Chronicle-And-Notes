import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Leaf, Map, Book, Users, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

function IntroSplash({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-emerald-950 text-white overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-emerald-900 via-emerald-800 to-black mix-blend-overlay" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="relative z-10 flex flex-col items-center"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-white/20 mb-8 shadow-2xl"
        >
          <img
            src={import.meta.env.BASE_URL + "yasir-photo.jpg"}
            alt="Yasir Ferooz"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80"; // fallback
            }}
          />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-emerald-200 uppercase tracking-[0.3em] text-sm md:text-base mb-4"
        >
          A Journey by
        </motion.p>
        
        <motion.h1
          className="font-serif text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 mb-6"
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{ delay: 2, duration: 1.5 }}
        >
          Yasir Ferooz
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100px" }}
          transition={{ delay: 2.5, duration: 1 }}
          className="h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent"
        />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <div className="relative">
      <AnimatePresence>
        {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      <div className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-background z-10" />
          <div className="w-full h-full bg-emerald-950 flex items-center justify-center opacity-80 mix-blend-overlay">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-800 via-emerald-950 to-black" />
          </div>
        </div>

        <div className="container relative z-20 px-4 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: !showIntro ? 1 : 0, y: !showIntro ? 0 : 30 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium mb-6">
              <Leaf className="w-4 h-4 text-emerald-400" />
              Welcome to Paradise on Earth
            </span>
            
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 drop-shadow-lg">
              Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">Kashmir</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto mb-10 drop-shadow">
              A comprehensive digital portal exploring the rich history, data, and academic resources of the valley. Crafted by Yasir Ferooz.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/history">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-emerald-600 hover:bg-emerald-700 text-white border-none shadow-xl shadow-emerald-900/20">
                  Explore History <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/notes">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full bg-white/10 hover:bg-white/20 text-white border-white/30 backdrop-blur-md">
                  Study Notes for Students
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-4xl font-bold text-foreground mb-4">A Portal for Knowledge</h2>
            <p className="text-muted-foreground text-lg">
              Bridging the gap between Kashmir's rich heritage and modern educational resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={Map}
              title="Rich History"
              desc="Dive into the centuries of cultural, religious, and political evolution that shaped the valley."
              href="/history"
              color="emerald"
            />
            <FeatureCard 
              icon={Users}
              title="Demographics & Data"
              desc="Visualizing the current state of Jammu & Kashmir through interactive charts and statistics."
              href="/data"
              color="blue"
            />
            <FeatureCard 
              icon={Compass}
              title="Explore Kashmir"
              desc="Travel guides and stories about Kashmir's most stunning places — written by a Kashmiri."
              href="/explore"
              color="teal"
            />
            <FeatureCard 
              icon={Book}
              title="JK BOSE Notes"
              desc="Premium quality, comprehensive study materials for Class 11th and 12th students."
              href="/notes"
              color="amber"
            />
          </div>
        </div>
      </section>
      
      {/* Creator Section */}
      <section className="py-24 bg-muted/30 border-t">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-background shadow-xl shrink-0">
              <img
                src={import.meta.env.BASE_URL + "yasir-photo.jpg"}
                alt="Yasir Ferooz"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80"; // fallback
                }}
              />
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold text-foreground mb-2">Meet the Creator</h2>
              <h3 className="text-xl text-primary font-medium mb-4">Yasir Ferooz</h3>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                "I built the Kashmir Portal with a dual purpose: to share the authentic beauty and deep history of my homeland with the world, and to provide a high-quality, accessible study platform for my fellow JK BOSE students. This is a labor of love for Kashmir."
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, href, color }: any) {
  const colorMap = {
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    teal: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 border-teal-200 dark:border-teal-800",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  };
  
  const iconColor = colorMap[color as keyof typeof colorMap];

  return (
    <Link href={href}>
      <motion.div 
        whileHover={{ y: -5 }}
        className="group p-8 rounded-2xl bg-card border shadow-sm hover:shadow-md transition-all h-full cursor-pointer"
      >
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 border ${iconColor}`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">
          {desc}
        </p>
      </motion.div>
    </Link>
  );
}
