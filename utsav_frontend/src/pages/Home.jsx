import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Accessibility, 
  Languages, 
  Zap, 
  Users, 
  BookOpen, 
  Globe, 
  Check,
  ArrowRight,
  Video,
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: Languages,
      title: "Multilingual Support",
      description: "Real-time captions in 9+ major Indian languages including Hindi, Bengali, Tamil, Telugu, Marathi, Malayalam, Odia, and more.",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Low Latency",
      description: "Ultra-fast processing ensures captions appear in real-time with minimal delay, perfect for live events and streaming.",
      color: "text-yellow-600"
    },
    {
      icon: Accessibility,
      title: "Simplified Captions",
      description: "AI-powered text simplification makes content accessible for low-literacy users and those with sign language as their first language.",
      color: "text-emerald-600"
    },
    {
      icon: Globe,
      title: "Platform Agnostic",
      description: "Seamlessly integrates with video players, meeting software, live events, and broadcast media platforms.",
      color: "text-purple-600"
    }
  ];

  const challenges = [
    "Lack of real-time captioning for live streams and online classes",
    "Low accuracy for diverse Indian languages and accents",
    "Complex literal transcriptions difficult to read at speed",
    "Limited accessibility for low-literacy users"
  ];

  const impact = [
    {
      icon: Users,
      metric: "10M+",
      label: "Potential Users",
      description: "Deaf and hard-of-hearing individuals in India"
    },
    {
      icon: BookOpen,
      metric: "100%",
      label: "Accessibility",
      description: "Full access to digital content and education"
    },
    {
      icon: TrendingUp,
      metric: "Real-time",
      label: "Processing",
      description: "Low-latency caption generation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-emerald-900/5 to-purple-900/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-blue-100 text-blue-700 border-blue-200 px-4 py-1.5 text-sm font-medium">
              AI-Powered Accessibility Solution
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Breaking the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">Digital Divide</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 mb-8 leading-relaxed">
              Real-time multilingual captions that make live digital content accessible to everyone, in their native Indian language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
  onClick={() => window.open("https://shell-1-18fb.onrender.com/", "_blank")}
  size="lg"
  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 px-8 py-6 text-lg"
>
  <Video className="w-5 h-5 mr-2" />
  Try Live Demo
  <ArrowRight className="w-5 h-5 ml-2" />
</Button>


              <Link to={createPageUrl("Documentation")}>
                <Button size="lg" variant="outline" className="border-2 border-slate-300 hover:border-slate-400 px-8 py-6 text-lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-4 py-2 rounded-full mb-6">
                <Target className="w-4 h-4" />
                <span className="font-semibold">The Challenge</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                The Digital Divide in Accessibility
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Deaf and hard-of-hearing individuals, along with those with low literacy, face significant barriers to accessing live digital content, events, and broadcast media.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed">
                Standard auto-generated captions are often too fast, too complex, or unavailable in native Indian languages, making comprehension difficult or impossible.
              </p>
            </div>
            <Card className="shadow-xl border-0 bg-gradient-to-br from-slate-50 to-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                  Key Challenges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {challenges.map((challenge, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-white border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-red-600 text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-slate-700">{challenge}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200 px-4 py-1.5">
              Our Solution
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Advanced AI-Powered Features
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Built for high accuracy and low latency, designed to integrate seamlessly with any digital platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${
                    feature.color === 'text-blue-600' ? 'from-blue-100 to-blue-200' :
                    feature.color === 'text-yellow-600' ? 'from-yellow-100 to-yellow-200' :
                    feature.color === 'text-emerald-600' ? 'from-emerald-100 to-emerald-200' :
                    'from-purple-100 to-purple-200'
                  } flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-900">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/20 text-white border-white/30 px-4 py-1.5">
              Measurable Impact
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Transforming Accessibility
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Creating a more inclusive digital world for millions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {impact.map((item, index) => (
              <Card key={index} className="bg-white/10 backdrop-blur-lg border-white/20 text-white shadow-2xl hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <item.icon className="w-12 h-12 mb-4 text-blue-200" />
                  <CardTitle className="text-4xl font-bold mb-2">
                    {item.metric}
                  </CardTitle>
                  <p className="text-lg font-semibold text-blue-100">{item.label}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-200">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-6 text-center">Key Benefits</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                "Enhanced Inclusivity: Full participation in live digital events and education",
                "Improved Comprehension: Simplified captions for low-literacy users",
                "Real-Time Access: Immediate, low-latency captions in multiple languages",
                "Platform-Wide: Flexible deployment across digital and offline platforms"
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-100">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to Experience the Future of Accessibility?
          </h2>
          <p className="text-lg text-slate-600 mb-8">
            Try our live demo and see how real-time multilingual captions can transform digital content accessibility.
          </p>
          <Link to={createPageUrl("LiveDemo")}>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-xl shadow-blue-500/30 px-10 py-7 text-xl">
              <Video className="w-6 h-6 mr-3" />
              Launch Live Demo
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}