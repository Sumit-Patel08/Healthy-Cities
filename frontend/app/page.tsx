"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Satellite, Droplets, Thermometer, Building2 } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-6">
              <Satellite className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">NASA Space Apps Challenge 2025</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-balance">
              <span className="text-foreground">CityForge</span>
              <br />
              <span className="text-primary text-glow">Mumbai Pulse</span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Monitoring Mumbai's environmental health and urban resilience through NASA satellite data
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link href="/dashboard">
                <Button size="lg" className="glow-amber group text-lg px-8">
                  Launch Dashboard
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                Learn More
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Environmental Intelligence</h2>
            <p className="text-xl text-muted-foreground">Real-time monitoring powered by space technology</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link href={feature.href}>
                  <div className="glass-panel rounded-xl p-6 h-full hover:glow-amber transition-all cursor-pointer group">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-32 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <p className="text-muted-foreground">Built for NASA Space Apps Challenge 2025</p>
            <p className="text-sm text-muted-foreground">Powered by NASA Earth Observation Data</p>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: "Air Quality",
    description: "Monitor pollutant levels and air quality indices across Mumbai",
    icon: Satellite,
    href: "/air-quality",
  },
  {
    title: "Heat Islands",
    description: "Track urban heat patterns and temperature anomalies",
    icon: Thermometer,
    href: "/heat-island",
  },
  {
    title: "Water Resources",
    description: "Analyze water bodies, soil moisture, and rainfall patterns",
    icon: Droplets,
    href: "/water-resources",
  },
  {
    title: "Urban Growth",
    description: "Visualize urban expansion and land use changes over time",
    icon: Building2,
    href: "/urban-development",
  },
]

const stats = [
  { value: "24/7", label: "Real-time Monitoring" },
  { value: "15+", label: "Data Sources" },
  { value: "5", label: "Key Metrics" },
  { value: "100%", label: "NASA Data" },
]
