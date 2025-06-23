import "./ConnectUsLoader.css"

const ConnectUsLoader = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex flex-col items-center">
        {/* Main Circle Container */}
        <div className="relative w-32 h-32 bg-white rounded-full shadow-xl border-4 border-blue-100 overflow-hidden loader-container">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Construction Worker */}
          <div className="worker worker-1 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">👷</div>
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-orange-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Electrician */}
          <div className="worker worker-2 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">⚡</div>
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-yellow-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Plumber */}
          <div className="worker worker-3 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🔧</div>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-blue-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Carpenter */}
          <div className="worker worker-4 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🪚</div>
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-amber-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Delivery Driver */}
          <div className="worker worker-5 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🚚</div>
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-green-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Housekeeper/Cleaner */}
          <div className="worker worker-6 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🧽</div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-purple-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Automotive Mechanic */}
          <div className="worker worker-7 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🔩</div>
              <div className="w-8 h-8 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-gray-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* HVAC Technician */}
          <div className="worker worker-8 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">❄️</div>
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-cyan-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Painter */}
          <div className="worker worker-9 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🎨</div>
              <div className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-red-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Landscaper */}
          <div className="worker worker-10 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🌱</div>
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-emerald-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Security Guard */}
          <div className="worker worker-11 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">🛡️</div>
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-indigo-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Warehouse Worker */}
          <div className="worker worker-12 absolute inset-0 flex items-center justify-center">
            <div className="text-center worker-content">
              <div className="text-2xl mb-1 tool-animation">📦</div>
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full mx-auto flex items-center justify-center worker-avatar">
                <div className="w-4 h-4 bg-teal-200 rounded-full pulse-effect"></div>
              </div>
            </div>
          </div>

          {/* Particle Effects inside circle */}
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
        </div>

        {/* Simple Loading Text */}
        <div className="mt-4 text-center">
          <div className="text-gray-700 font-medium text-lg">Finding Workers</div>
          <div className="loading-dots mt-2 flex justify-center space-x-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full dot-1"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full dot-2"></span>
            <span className="w-2 h-2 bg-blue-500 rounded-full dot-3"></span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectUsLoader
