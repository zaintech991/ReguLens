"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Brain, AlertTriangle, TrendingUp, ArrowRight, CheckCircle2, Zap, BarChart, Users, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { TopNavbar } from "@/components/layout/TopNavbar";
import { Logo } from "@/components/ui/Logo";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col font-sans">
      <TopNavbar />

      {/* Enhanced Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply" style={{ animationDelay: "4s" }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-gray-200 backdrop-blur-sm mb-8 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">AI Compliance Engine v2.0 is live</span>
              </div>
              
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                Compliance that <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-600 to-blue-600 animate-gradient-x">
                  thinks ahead.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
                Stop reacting to violations. Start preventing them. Our AI constantly monitors your operations to ensure 100% regulatory compliance and safety.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-20">
                <Link href="/dashboard">
                  <Button size="lg" className="text-lg px-10 h-16 rounded-full bg-gray-900 text-white hover:bg-gray-800 hover:scale-105 transition-all shadow-2xl shadow-gray-900/20">
                    Start Monitoring Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button size="lg" variant="outline" className="text-lg px-10 h-16 rounded-full bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white hover:scale-105 transition-all shadow-sm">
                    Watch Explainer
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Floating UI Mockup */}
          <motion.div 
            initial={{ opacity: 0, y: 60, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.3, type: "spring", bounce: 0.2 }}
            className="relative max-w-6xl mx-auto perspective-1000"
          >
             <div className="rounded-2xl border border-white/40 bg-white/60 backdrop-blur-xl shadow-[0_0_80px_-20px_rgba(0,0,0,0.15)] p-2 md:p-4">
               <div className="rounded-xl border border-gray-200/50 bg-white/90 shadow-inner overflow-hidden aspect-[16/9] relative group">
                  {/* Mock Dashboard UI */}
                  <div className="absolute inset-0 bg-gray-50 flex flex-col">
                    <div className="h-12 border-b border-gray-200 flex items-center px-4 gap-2 bg-white">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="ml-4 h-6 w-64 bg-gray-100 rounded-full" />
                    </div>
                    <div className="flex-1 p-6 flex gap-6">
                      <div className="w-64 hidden md:block space-y-3">
                        <div className="h-10 w-full bg-primary/10 rounded-lg" />
                        <div className="h-8 w-full bg-gray-100 rounded-lg" />
                        <div className="h-8 w-full bg-gray-100 rounded-lg" />
                      </div>
                      <div className="flex-1 space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full mb-3" />
                            <div className="h-6 w-20 bg-gray-100 rounded mb-2" />
                            <div className="h-8 w-12 bg-gray-200 rounded" />
                          </div>
                          <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <div className="w-10 h-10 bg-green-100 rounded-full mb-3" />
                            <div className="h-6 w-20 bg-gray-100 rounded mb-2" />
                            <div className="h-8 w-12 bg-gray-200 rounded" />
                          </div>
                          <div className="h-32 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                            <div className="w-10 h-10 bg-purple-100 rounded-full mb-3" />
                            <div className="h-6 w-20 bg-gray-100 rounded mb-2" />
                            <div className="h-8 w-12 bg-gray-200 rounded" />
                          </div>
                        </div>
                        <div className="h-64 bg-white rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
                          {/* Animated Graph Line */}
                          <svg className="w-full h-full text-primary opacity-20" preserveAspectRatio="none">
                            <path d="M0 200 Q 200 100 400 150 T 800 50" stroke="currentColor" strokeWidth="4" fill="none" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-10 border-y border-gray-100 bg-gray-50/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mb-8">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {['Acme Corp', 'Global Ind', 'TechFlow', 'SafeWorks', 'EcoSys'].map((name) => (
              <div key={name} className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-400 rounded-full" />
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 relative">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">Everything you need to stay compliant</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A complete suite of tools designed to make compliance monitoring effortless, accurate, and predictive.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {/* Large Card */}
            <div className="md:col-span-2 row-span-2 bg-gradient-to-br from-blue-50 via-indigo-50 to-indigo-100 rounded-3xl p-10 border border-indigo-100/50 relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-200/40 transition-all duration-500">
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                <Brain className="w-64 h-64 text-indigo-600" />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-md shadow-indigo-100 text-indigo-600">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-gray-900">Deep Learning Analysis</h3>
                <p className="text-lg text-gray-600 max-w-md mb-8 leading-relaxed">
                  Our advanced NLP models read and understand complex regulatory documents just like a human expert, but instantly.
                </p>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-indigo-50 max-w-lg">
                  <div className="flex gap-3 mb-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    <p className="text-sm text-gray-700 font-medium">Extracted rule: "Emissions must remain under 20ppm"</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2" />
                    <p className="text-sm text-gray-600">Cross-referenced with: ISO 14001 Standards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Cards */}
            <FeatureCard 
              icon={Shield} 
              title="Real-time Monitoring" 
              desc="Continuous 24/7 monitoring of operational logs against safety thresholds."
              gradient="bg-gradient-to-br from-purple-50 to-purple-100/60"
              iconColor="text-purple-600"
              borderColor="border-purple-100/50"
            />
            <FeatureCard 
              icon={AlertTriangle} 
              title="Smart Alerts" 
              desc="Instant notifications with severity classification and actionable insights."
              gradient="bg-gradient-to-br from-amber-50 to-amber-100/60"
              iconColor="text-amber-600"
              borderColor="border-amber-100/50"
            />
            <FeatureCard 
              icon={TrendingUp} 
              title="Predictive Analytics" 
              desc="Forecast potential violations based on historical trends and data patterns."
              gradient="bg-gradient-to-br from-emerald-50 to-emerald-100/60"
              iconColor="text-emerald-600"
              borderColor="border-emerald-100/50"
            />
            <FeatureCard 
              icon={CheckCircle2} 
              title="Automated Reporting" 
              desc="Generate audit-ready reports with a single click. Never miss a deadline."
              gradient="bg-gradient-to-br from-cyan-50 to-cyan-100/60"
              iconColor="text-cyan-600"
              borderColor="border-cyan-100/50"
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="bg-gray-900 rounded-[2.5rem] p-12 md:p-24 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-gradient-to-br from-primary/30 via-purple-500/30 to-blue-500/30 animate-spin-slow"></div>
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
                Ready to modernize your safety operations?
              </h2>
              <p className="text-xl text-gray-400 mb-12 leading-relaxed">
                Join 500+ enterprise companies using ReguLens to protect their workforce and ensure regulatory compliance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 h-14 px-10 text-lg rounded-full font-bold">
                  Get Started Now
                </Button>
                <Button size="lg" variant="outline" className="border-gray-700 text-white hover:bg-gray-800 h-14 px-10 text-lg rounded-full bg-transparent">
                  Talk to Sales
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-12 mb-16">
            <div className="col-span-2">
              <div className="mb-6">
                <Logo size="lg" showText={true} />
              </div>
              <p className="text-gray-500 max-w-sm mb-8">
                The world's most advanced compliance monitoring platform. Built for the enterprise, powered by next-gen AI.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <Globe className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <Users className="w-5 h-5" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-colors cursor-pointer">
                  <Lock className="w-5 h-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Product</h4>
              <ul className="space-y-4 text-gray-500">
                <li className="hover:text-primary cursor-pointer transition-colors">Features</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Integrations</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Enterprise</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Security</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Resources</h4>
              <ul className="space-y-4 text-gray-500">
                <li className="hover:text-primary cursor-pointer transition-colors">Documentation</li>
                <li className="hover:text-primary cursor-pointer transition-colors">API Reference</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Blog</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Community</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-900 mb-6">Company</h4>
              <ul className="space-y-4 text-gray-500">
                <li className="hover:text-primary cursor-pointer transition-colors">About</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Careers</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Legal</li>
                <li className="hover:text-primary cursor-pointer transition-colors">Contact</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">
            <p>© 2024 ReguLens Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
              <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, gradient, iconColor, borderColor }: { icon: any, title: string, desc: string, gradient?: string, iconColor?: string, borderColor?: string }) {
  return (
    <div className={`${gradient || 'bg-gray-50'} p-8 rounded-3xl border ${borderColor || 'border-gray-100'} hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1 group`}>
      <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 ${iconColor || 'text-primary'} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900">{title}</h3>
      <p className="text-gray-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
