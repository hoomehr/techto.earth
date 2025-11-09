import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, BarChart3, Zap, TrendingUp, AlertCircle, Leaf, Target } from "lucide-react"

export default function EcoLogHome() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-50 to-white py-20 md:py-28">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-100 rounded-full px-4 py-2 mb-6">
            <BarChart3 className="h-5 w-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-800">Smart Environment Management</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 mb-4">
            Welcome to <span className="text-emerald-600">EcoLog</span>
          </h1>

          <p className="max-w-3xl text-lg md:text-xl text-slate-600 mb-8">
            Your intelligent companion for managing healthy, high-performance environments. From growing and production
            spaces to natural and living systems, EcoLog brings everything together in one smart dashboard. Select any
            environment to access AI-powered insights, priority tasks, and real-time guidance.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Use Cases */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Designed for Every Environment</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Whether you're managing farms, greenhouses, aquaculture systems, or natural ecosystems, EcoLog adapts to
              your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Agricultural Production</CardTitle>
                <CardDescription>Optimize crop yields and soil health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor soil conditions, weather patterns, and crop development in real-time. Get AI-powered
                  recommendations for irrigation, fertilization, and pest management.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center mb-2">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <CardTitle>Greenhouse Management</CardTitle>
                <CardDescription>Control climate and resource use</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Maintain optimal temperature, humidity, and light levels. Automate irrigation and ventilation systems
                  while minimizing energy consumption.
                </p>
              </CardContent>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Aquaculture Systems</CardTitle>
                <CardDescription>Monitor water quality and fish health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Track pH, oxygen levels, temperature, and other critical parameters. Receive alerts for any anomalies
                  and get guidance on corrective actions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>Ecosystem Monitoring</CardTitle>
                <CardDescription>Support natural and living systems</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Monitor biodiversity, water quality, and environmental health. Gain insights into species presence,
                  population trends, and habitat conditions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="max-w-2xl mx-auto text-lg text-slate-600">
              Everything you need to manage and optimize your environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Smart Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Access all your environments in one unified dashboard. View real-time conditions, AI-powered insights,
                  and priority tasks. Each log combines your photos and notes with automated analysis for complete
                  traceability.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                  <AlertCircle className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Early Warning System</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Turn on automation to enable intelligent routines, early-warning alerts, and data-driven
                  recommendations based on environmental signals and your goals. Catch issues before they become
                  problems.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-pink-600" />
                </div>
                <CardTitle>Activity Logging</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Every log combines your photos and notes with automated analysis. Track conditions, catch early
                  issues, and support long-term health. Every activity is recorded, giving you clarity and confidence
                  in decisions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4">
                  <Leaf className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle>AI-Powered Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Get intelligent analysis of conditions, catch early issues, and receive actionable recommendations to
                  support long-term health and productivity. Make data-driven decisions with confidence.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Automation & Routines</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Set up intelligent routines that adapt to your environment's needs, saving time and optimizing
                  resource use automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-cyan-100 flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-cyan-600" />
                </div>
                <CardTitle>Priority Task Management</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600">
                <p>
                  Focus on what matters most with AI-prioritized tasks. Know exactly what actions to take and when to
                  take them.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How EcoLog Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600">1</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Connect & Setup</h3>
              <p className="text-slate-600">
                Link your sensors, devices, or manually input data about your environment
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-600">2</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Monitor & Analyze</h3>
              <p className="text-slate-600">
                Get real-time data analysis and AI-powered insights about your environment's health
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-green-600">3</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Act & Optimize</h3>
              <p className="text-slate-600">Receive recommendations and automate routine tasks based on your goals</p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-emerald-600">4</span>
                </div>
              </div>
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Track & Improve</h3>
              <p className="text-slate-600">
                Log activities and review insights to continuously improve performance and outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Intelligence for Every Environment That Grows, Produces, or Sustains Life
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-emerald-50 mb-8">
            Whether you're optimizing agricultural production, managing a greenhouse, monitoring an ecosystem, or
            supporting any living system, EcoLog is your intelligent companion. Every activity and insight is recorded,
            giving you clarity, traceability, and confidence in every decision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50">
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-emerald-200 text-white hover:bg-emerald-700 bg-transparent"
            >
              Schedule Demo <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
