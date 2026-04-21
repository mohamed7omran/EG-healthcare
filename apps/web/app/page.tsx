import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Stethoscope, Calendar, MessageCircle, BarChart3, Award, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:inline">EGhealthcare</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button variant="outline" className="border-input hover:bg-secondary/50 bg-transparent">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Split Layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent mb-6">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-medium text-foreground">Revolutionizing Healthcare</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 text-balance leading-tight">
              Your Health, Our Priority
            </h1>
            <p className="text-lg text-muted-foreground mb-8 text-balance">
              Connect with board-certified doctors, schedule appointments seamlessly, and get AI-powered health insights—all in one secure platform built for your wellness.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="border-input hover:bg-secondary/50 bg-transparent">
                  Sign In
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              ✓ No credit card required · ✓ 7-day free trial · ✓ Cancel anytime
            </p>
          </div>
          <div className="animate-slide-up hidden md:block" style={{ animationDelay: '100ms' }}>
            <div className="space-y-4">
              <div className="medical-card-hover group p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Instant Booking</h4>
                    <p className="text-sm text-muted-foreground">Schedule appointments in seconds</p>
                  </div>
                </div>
              </div>
              <div className="medical-card-hover group p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <MessageCircle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">24/7 Chat Support</h4>
                    <p className="text-sm text-muted-foreground">Talk to doctors anytime, anywhere</p>
                  </div>
                </div>
              </div>
              <div className="medical-card-hover group p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <BarChart3 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Health Analytics</h4>
                    <p className="text-sm text-muted-foreground">Track your health metrics easily</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 border-y border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-2">50K+</div>
            <p className="text-sm text-muted-foreground">Active Patients</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">2K+</div>
            <p className="text-sm text-muted-foreground">Verified Doctors</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">98%</div>
            <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
          </div>
          <div>
            <div className="text-3xl font-bold text-primary mb-2">100K+</div>
            <p className="text-sm text-muted-foreground">Appointments</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Everything You Need for Better Health</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Comprehensive features designed to give you the best healthcare experience</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Stethoscope, title: 'Expert Doctors', desc: 'Network of verified medical professionals' },
            { icon: Calendar, title: 'Easy Scheduling', desc: 'Book appointments at your convenience' },
            { icon: MessageCircle, title: 'Direct Chat', desc: 'Secure communication with physicians' },
            { icon: BarChart3, title: 'Health Tracking', desc: 'Monitor your health metrics over time' },
            { icon: Award, title: 'Verified Credentials', desc: 'All doctors are certified specialists' },
            { icon: TrendingUp, title: 'AI Health Insights', desc: 'Personalized health recommendations' },
          ].map((feature, idx) => (
            <div key={idx} className="medical-card-hover group">
              <div className="w-12 h-12 rounded-lg bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 md:px-6 py-20">
        <div className="medical-card-hover bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Transform Your Healthcare?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of patients getting better care today. Start your free trial now.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg">
                  Create Free Account
                </Button>
              </Link>
              <Link href="/signin">
                <Button size="lg" variant="outline" className="border-input hover:bg-secondary/50 bg-transparent">
                  Already a Member?
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 mt-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">EGhealthcare</span>
              </div>
              <p className="text-sm text-muted-foreground">Transforming healthcare through technology and compassion.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-muted-foreground">© 2025 EGhealthcare. All rights reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">LinkedIn</a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">Facebook</a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
