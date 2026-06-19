import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-emerald-950 to-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/80 backdrop-blur-sm border-b border-emerald-900/30 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-mono text-lg font-bold text-white tracking-wider">SmartSeason</span>
            <span className="text-gray-400 text-sm">Field Monitoring System</span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight">
              Every field, <em className="italic text-emerald-300">every stage,</em> accounted for.
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              SmartSeason tracks crop progress across multiple fields during a growing season. Admins assign and monitor; field agents update stages — with automatic alerts for fields past 90 days without harvest.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg p-4">
              <p className="font-mono text-amber-400 text-2xl font-bold">247</p>
              <p className="text-gray-300 text-xs mt-1">Fields Tracked</p>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg p-4">
              <p className="font-mono text-amber-400 text-2xl font-bold">38</p>
              <p className="text-gray-300 text-xs mt-1">Field Agents</p>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg p-4">
              <p className="font-mono text-amber-400 text-2xl font-bold">6</p>
              <p className="text-gray-300 text-xs mt-1">Growth Stages</p>
            </div>
            <div className="bg-emerald-900/40 border border-emerald-700/50 rounded-lg p-4">
              <p className="font-mono text-amber-400 text-2xl font-bold">91%</p>
              <p className="text-gray-300 text-xs mt-1">On-Time Harvest</p>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-semibold transition text-center">
              Get Started
            </Link>
            <button className="border border-emerald-500 hover:bg-emerald-900/30 text-emerald-300 px-8 py-3 rounded-lg font-semibold transition">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* At-Risk Callout */}
      <section className="py-16 px-6 bg-amber-500/10 border-y border-amber-500/30">
        <div className="max-w-4xl mx-auto">
          <p className="text-amber-300 font-mono text-sm font-bold mb-3">⚠️ AUTOMATED AT-RISK DETECTION</p>
          <p className="text-gray-200 text-lg leading-relaxed">
            Automated at-risk detection flags fields exceeding 90 days from planting without a recorded harvest — no field falls through the cracks.
          </p>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 px-6 border-t border-emerald-900/30">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="font-serif text-3xl font-bold text-white mb-6">Ready to optimize your fields?</h3>

          {subscribed ? (
            <div className="bg-emerald-900/40 border border-emerald-500 rounded-lg p-4 text-emerald-300 font-semibold">
              ✓ Thanks! Check your email for early access details.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-emerald-700/30 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                required
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-gray-900 px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition">
                Request Access
              </button>
            </form>
          )}

          <div className="mt-12 pt-8 border-t border-emerald-900/30 text-gray-500 text-xs">
            <p>© 2026 SmartSeason. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
