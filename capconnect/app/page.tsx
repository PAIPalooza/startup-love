import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CapConnect</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/auth/login"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            The smartest way to
            <span className="text-indigo-600"> match capital </span>
            with innovation
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            CapConnect streamlines fundraising for founders and deal discovery for investors. 
            Manage cap tables, SPVs, and investor relationships all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/login"
              className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
            >
              Start Fundraising
            </Link>
            <Link
              href="/auth/login"
              className="px-8 py-3 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium"
            >
              Find Startups
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Founders</h3>
            <p className="text-gray-600">
              Create company profiles, manage cap tables, upload documents, and track investor activity. 
              Streamline your fundraising process.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">For Investors</h3>
            <p className="text-gray-600">
              Browse vetted startups, access data rooms, participate in SPVs, and manage your investment portfolio.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">SPV Management</h3>
            <p className="text-gray-600">
              Create and manage Special Purpose Vehicles to pool investor funds and simplify cap table complexity.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Cap Table Management</h3>
            <p className="text-gray-600">
              OCTA-compliant cap table management with equity modeling, share class tracking, and stakeholder management.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Data Rooms</h3>
            <p className="text-gray-600">
              Upload and share documents with granular access controls. Track who views what and when.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-3xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">AI-Powered Matching</h3>
            <p className="text-gray-600">
              Semantic search and intelligent matching between investors and startups based on preferences and thesis.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">1️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Create Profile</h3>
              <p className="text-gray-600">
                Sign up and choose your role: Founder or Investor. Complete your profile and company details.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">2️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect & Discover</h3>
              <p className="text-gray-600">
                Founders upload documents and create SPVs. Investors browse opportunities and express interest.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">3️⃣</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Close Deals</h3>
              <p className="text-gray-600">
                Manage investments, track commitments, and close funding rounds with integrated cap table management.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 bg-indigo-600 rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-indigo-100 mb-6 text-lg">
            Join the smartest fundraising network and accelerate your success.
          </p>
          <Link
            href="/auth/login"
            className="px-8 py-3 bg-white text-indigo-600 rounded-lg hover:bg-gray-100 font-medium inline-block"
          >
            Get Started Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 CapConnect. Built with Next.js, Supabase, and Claude.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}