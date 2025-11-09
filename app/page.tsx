import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Sprout, BarChart3, Zap } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white via-green-50/30 to-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-green-100 border border-green-200 rounded-full px-4 py-2 mb-8">
            <Sprout className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-700">Technology for Earth</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-7xl font-bold tracking-tight mb-6 text-balance text-slate-900">
            Techto{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Earth</span>
          </h1>

          <p className="max-w-3xl text-xl md:text-2xl text-slate-600 mb-12 text-balance">
            Technology for earthic and ecologic use cases. We build intelligent tools and communities that bridge
            technology with sustainable living, personal transformation, and environmental stewardship.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
              Explore Products
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50 bg-transparent"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Our Products</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Intelligent solutions designed for earthic and ecologic use cases — bridging technology with nature,
              growth, and sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* EarthBridge Product */}
            <Card className="border border-slate-200 overflow-hidden hover:border-green-300 transition-all duration-300 group shadow-lg hover:shadow-green-200/50 hover:shadow-2xl">
              <CardHeader className="pt-8">
                <div className="flex items-center gap-3 mb-2">
                  <Sprout className="h-8 w-8 text-green-600" />
                  <CardTitle className="text-2xl text-green-700">EarthBridge</CardTitle>
                </div>
                <CardDescription className="text-base">Bridging Tech to Earth Careers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">
                  A complete transition program for tech professionals seeking meaningful work in agriculture, farming,
                  restaurants, and manual trades. Your bridge to a more connected life.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Expert-led courses and training</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Networking events and farm tours</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Community support groups</span>
                  </li>
                </ul>
              </CardContent>
              <div className="px-6 pb-6">
                <Button asChild size="sm" className="bg-green-600 hover:bg-green-700">
                  <Link href="/career-path">
                    Explore EarthBridge <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* EcoLog Product */}
            <Card className="border border-slate-200 overflow-hidden hover:border-emerald-300 transition-all duration-300 group shadow-lg hover:shadow-emerald-200/50 hover:shadow-2xl">
              <CardHeader className="pt-8">
                <div className="flex items-center gap-3 mb-2">
                  <BarChart3 className="h-8 w-8 text-emerald-600" />
                  <CardTitle className="text-2xl text-emerald-700">EcoLog</CardTitle>
                </div>
                <CardDescription className="text-base">Smart Environment Management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">
                  Your intelligent companion for managing healthy, high-performance environments. From growing spaces to
                  natural ecosystems, track conditions, get AI insights, and optimize for long-term health.
                </p>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>AI-powered environmental insights</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Real-time monitoring dashboard</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-emerald-600">✓</span>
                    <span>Automated alerts and recommendations</span>
                  </li>
                </ul>
              </CardContent>
              <div className="px-6 pb-6">
                <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/ecolog">
                    Explore EcoLog <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Techto Earth */}
      <section className="py-20 md:py-28 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Why Techto Earth</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              We're building a future where technology and nature work in harmony
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>For Individuals</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Find meaningful work, build real skills, and connect with a supportive community of like-minded
                professionals.
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>For Businesses</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Optimize your operations with AI-powered insights and intelligent monitoring for sustainable growth.
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>For Earth</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                Supporting sustainable practices, healthier ecosystems, and a more conscious relationship with our
                environment.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="max-w-2xl mx-auto text-lg text-green-50 mb-8">
            Join thousands of people building a better relationship between technology and nature.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-green-700 hover:bg-green-50">
              Get Started Today
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-green-200 text-white hover:bg-green-700 bg-transparent"
            >
              Browse Products
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
