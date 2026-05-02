import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Zap, ArrowRight, CheckCircle2, Shield, BarChart3, Users, Play, Cpu } from 'lucide-react';
import { signInWithGoogle } from '../lib/firebase';

const LandingPage: React.FC = () => {
  return (
    <div className="pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 md:pt-32 md:pb-48">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-linear-to-b from-primary/5 to-transparent blur-3xl opacity-50" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-8">
              <Zap className="w-3 h-3 fill-current" />
              Next-Gen Automation
            </span>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1]">
              Automate Manual Workflows <span className="text-primary italic">Seamlessly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
              Zaplo is your productivity engine for automating repetitive tasks and complex manual workflows across your organization.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button size="lg" onClick={signInWithGoogle} className="rounded-full h-14 px-8 text-lg shadow-xl shadow-primary/20">
                Get Started Free <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg border-2">
                Watch Demo <Play className="ml-2 w-4 h-4 fill-current" />
              </Button>
            </div>
          </motion.div>

          {/* Abstract Dashboard UI Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative mx-auto max-w-5xl"
          >
            <div className="relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl glass-card aspect-video">
               <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent" />
               <div className="h-12 border-b border-border/40 flex items-center px-4 gap-2">
                 <div className="w-3 h-3 rounded-full bg-red-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
                 <div className="ml-4 h-6 w-32 bg-muted/30 rounded" />
               </div>
               <div className="p-8 grid grid-cols-12 gap-6 h-full">
                 <div className="col-span-3 space-y-4">
                    <div className="h-32 bg-primary/5 rounded-xl border border-primary/10" />
                    <div className="h-32 bg-muted/10 rounded-xl" />
                    <div className="h-32 bg-muted/10 rounded-xl" />
                 </div>
                 <div className="col-span-9 space-y-6">
                    <div className="h-48 bg-muted/10 rounded-xl" />
                    <div className="grid grid-cols-2 gap-6">
                       <div className="h-32 bg-muted/10 rounded-xl" />
                       <div className="h-32 bg-muted/10 rounded-xl" />
                    </div>
                 </div>
               </div>

               {/* Overlay "Flow" connecting elements */}
               <svg className="absolute inset-x-0 bottom-0 top-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 200 300 Q 400 100 600 300 T 800 300" stroke="currentColor" fill="transparent" strokeWidth="2" strokeDasharray="5,5" className="text-primary" />
               </svg>
            </div>
            
            {/* Floating elements */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-10 -right-10 bg-white p-4 rounded-xl shadow-xl border border-border flex items-center gap-3"
            >
               <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
               </div>
               <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</div>
                  <div className="font-semibold">Workflow Verified</div>
               </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">Built for Business Velocity</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Replace rigid legacy systems with fluid, AI-augmented workflows that adapt to your team.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Cpu className="w-8 h-8" />,
                title: "Intelligent Automation",
                desc: "Smart rule-based triggers and actions that learn from your business logic."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Guaranteed Quality",
                desc: "Integrated validation layers ensure every automated step meets your standards."
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Human-in-the-Loop",
                desc: "Seamlessly transition from bot to human when nuanced decisions are required."
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Real-time Analytics",
                desc: "Monitor your entire operations pipeline with granular visibility into every task."
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Instant Integration",
                desc: "Connect your existing stack with pre-built connectors or custom API endpoints."
              },
              {
                icon: <ArrowRight className="w-8 h-8" />,
                title: "Scalable Infrastructure",
                desc: "Built on cloud-native architecture that grows effortlessly with your data volume."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-background p-8 rounded-2xl border border-border/60 shadow-sm hover:shadow-md transition-all"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/5 text-primary flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-primary rounded-[2rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <h2 className="text-3xl md:text-5xl font-bold font-display text-primary-foreground mb-8 relative z-10 leading-tight">
              Ready to transform your manual operations?
            </h2>
            <Button size="lg" variant="secondary" onClick={signInWithGoogle} className="rounded-full h-14 px-10 text-lg relative z-10">
              Start Building Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border/40">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <span className="font-sans font-bold text-lg tracking-tight">Zaplo</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-muted-foreground">
             <Link to="#" className="hover:text-foreground transition-colors">Privacy</Link>
             <Link to="#" className="hover:text-foreground transition-colors">Terms</Link>
             <Link to="#" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Zaplo Technologies Inc. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
