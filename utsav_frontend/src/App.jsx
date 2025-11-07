// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import LiveDemo from './pages/LiveDemo';
import Documentation from './pages/Documentation';
import Settings from './pages/Settings';
import { Button } from '@/components/ui/button';
import { Home as HomeIcon, Video, BookOpen, Settings as SettingsIcon } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="App min-h-screen bg-slate-50">
        {/* Navigation Bar */}
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              {/* Logo/Brand */}
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AC</span>
                </div>
                <span className="text-xl font-bold text-slate-900 hidden sm:inline">
                  Shravan Ai
                </span>
              </Link>

              {/* Navigation Links */}
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <HomeIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Home</span>
                  </Button>
                </Link>
                <Link to="/live-demo">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Demo</span>
                  </Button>
                </Link>
                <Link to="/documentation">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span className="hidden sm:inline">Docs</span>
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Settings</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/live-demo" element={<LiveDemo />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 mt-20">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">AC</span>
                  </div>
                  <span className="text-lg font-bold text-slate-900">AccessCaption</span>
                </div>
                <p className="text-slate-600 mb-4">
                  Breaking the digital divide with AI-powered multilingual captions for accessible content.
                </p>
                <p className="text-sm text-slate-500">
                  © 2024 AccessCaption. All rights reserved.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="/live-demo" className="text-slate-600 hover:text-blue-600">Live Demo</Link></li>
                  <li><Link to="/documentation" className="text-slate-600 hover:text-blue-600">Documentation</Link></li>
                  <li><Link to="/settings" className="text-slate-600 hover:text-blue-600">Settings</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Support</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-slate-600 hover:text-blue-600">Help Center</a></li>
                  <li><a href="#" className="text-slate-600 hover:text-blue-600">Contact Us</a></li>
                  <li><a href="#" className="text-slate-600 hover:text-blue-600">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;