import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Code, 
  Zap, 
  Shield, 
  Globe,
  Check,
  AlertCircle,
  Smartphone,
  Monitor,
  Video
} from "lucide-react";

export default function Documentation() {
  const features = [
    {
      title: "Multi-language Support",
      items: [
        "Hindi (हिन्दी)",
        "Bengali (বাংলা)",
        "Tamil (தமிழ்)",
        "Telugu (తెలుగు)",
        "Marathi (मराठी)",
        "Malayalam (മലയാളം)",
        "Kannada (ಕನ್ನಡ)",
        "Gujarati (ગુજરાતી)",
        "Odia (ଓଡ଼ିଆ)"
      ]
    }
  ];

  const technicalSpecs = [
    { label: "Latency", value: "~150ms", icon: Zap, color: "text-yellow-600" },
    { label: "Accuracy", value: "95%+", icon: Check, color: "text-emerald-600" },
    { label: "Languages", value: "9+", icon: Globe, color: "text-blue-600" },
    { label: "Platform", value: "Universal", icon: Monitor, color: "text-purple-600" }
  ];

  const integrations = [
    {
      platform: "Web Video Players",
      description: "Seamless integration with HTML5 video players, YouTube embeds, and custom video solutions",
      icon: Video
    },
    {
      platform: "Meeting Software",
      description: "Compatible with Zoom, Google Meet, Microsoft Teams, and other conferencing platforms",
      icon: Monitor
    },
    {
      platform: "Mobile Apps",
      description: "Native SDK support for iOS and Android applications with minimal integration effort",
      icon: Smartphone
    },
    {
      platform: "Live Events",
      description: "Offline-capable solution for conferences, seminars, and public broadcasts",
      icon: Globe
    }
  ];

  const useCases = [
    {
      title: "Online Education",
      description: "Enable students with hearing impairment to access live lectures, webinars, and educational content in their native language.",
      benefits: ["Real-time comprehension", "Language flexibility", "Better retention"]
    },
    {
      title: "Live Streaming",
      description: "Make YouTube live streams, news broadcasts, and entertainment content accessible to deaf and hard-of-hearing viewers.",
      benefits: ["Wider audience reach", "Improved engagement", "Social inclusion"]
    },
    {
      title: "Corporate Meetings",
      description: "Ensure inclusive workplace communication during virtual meetings, presentations, and training sessions.",
      benefits: ["Equal participation", "Compliance ready", "Productivity boost"]
    },
    {
      title: "Public Events",
      description: "Provide accessibility at conferences, government announcements, and cultural events with offline captioning.",
      benefits: ["Legal compliance", "Universal access", "Community building"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4 bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
            Documentation
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Technical Documentation
          </h1>
          <p className="text-xl text-slate-600">
            Comprehensive guide to understanding and implementing our AI-powered multilingual captioning system
          </p>
        </div>

        {/* Technical Specifications */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Code className="w-7 h-7 text-blue-600" />
            Technical Specifications
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {technicalSpecs.map((spec, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <spec.icon className={`w-10 h-10 mx-auto mb-3 ${spec.color}`} />
                  <p className="text-3xl font-bold text-slate-900 mb-1">{spec.value}</p>
                  <p className="text-sm text-slate-600">{spec.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Language Support */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Globe className="w-7 h-7 text-emerald-600" />
            Supported Languages
          </h2>
          <Card className="border-0 shadow-lg">
            <CardContent className="p-8">
              <p className="text-slate-600 mb-6">
                Our system supports real-time speech-to-text conversion and caption generation in the following major Indian languages:
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                {features[0].items.map((lang, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gradient-to-r from-slate-50 to-white rounded-lg border border-slate-200">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span className="font-medium text-slate-900">{lang}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  <AlertCircle className="w-4 h-4 inline mr-2" />
                  <strong>Note:</strong> The system handles diverse regional accents and dialects within each language for improved accuracy.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Key Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Zap className="w-7 h-7 text-yellow-600" />
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Real-Time Processing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  Advanced AI algorithms ensure ultra-low latency (~150ms) for near-instantaneous caption generation during live content.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">High-accuracy speech recognition</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Optimized for live streaming</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Minimal buffer requirements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Simplified Captioning</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  AI-powered text simplification converts complex transcriptions into easy-to-read captions for better comprehension.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Simplified vocabulary and grammar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Shorter sentence structures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Optimized reading speed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Accessibility First</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  Designed specifically for deaf, hard-of-hearing, and low-literacy users with comprehensive customization options.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Adjustable font size and contrast</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">Flexible caption positioning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">High contrast mode</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Security & Privacy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600">
                  Enterprise-grade security ensures your audio and caption data remains private and protected at all times.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">End-to-end encryption</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">GDPR compliant</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700">No data retention policy</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Platform Integration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <Monitor className="w-7 h-7 text-purple-600" />
            Platform Integration
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {integrations.map((integration, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <integration.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">{integration.platform}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-blue-600" />
            Use Cases
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">{useCase.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600">{useCase.description}</p>
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Benefits:</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.benefits.map((benefit, idx) => (
                        <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Getting Started */}
        <section>
          <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Getting Started</h2>
              <p className="text-blue-100 text-lg mb-6">
                Ready to integrate our captioning solution into your platform? Contact our team for API access, documentation, and implementation support.
              </p>
              <div className="flex flex-wrap gap-4">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                  API Documentation Available
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                  SDK Support
                </Badge>
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2 text-sm">
                  24/7 Technical Support
                </Badge>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}