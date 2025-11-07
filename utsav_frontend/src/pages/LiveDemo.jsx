import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings as SettingsIcon, 
  Languages,
  Type,
  Maximize2,
  Loader2,
  Link as LinkIcon,
  Mic,
  Video as VideoIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import CaptionDisplay from "@/components/demo/CaptionDisplay";
import LanguageSelector from "@/components/demo/LanguageSelector";
import CaptionSettings from "@/components/demo/CaptionSettings";
import MicrophoneCapture from "@/components/demo/MicrophoneCapture";

export default function LiveDemo() {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [inputUrl, setInputUrl] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("hindi");
  const [simplifyMode, setSimplifyMode] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [captionSize, setCaptionSize] = useState(18);
  const [captionPosition, setCaptionPosition] = useState("bottom");
  const [highContrast, setHighContrast] = useState(false);
  const [currentCaption, setCurrentCaption] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("video");
  const [micCaption, setMicCaption] = useState("");

  // Demo captions in different languages
  const demoCaptions = {
    hindi: [
      { time: 0, standard: "आज हम एक बहुत महत्वपूर्ण विषय पर चर्चा करेंगे जो डिजिटल समावेशन से संबंधित है।", simple: "आज हम एक खास बात करेंगे। यह बात डिजिटल समावेशन के बारे में है।" },
      { time: 5, standard: "प्रौद्योगिकी का उपयोग करके हम समाज के सभी वर्गों को जोड़ सकते हैं।", simple: "टेक्नोलॉजी से हम सबको जोड़ सकते हैं।" },
      { time: 10, standard: "यह विशेष रूप से बधिर और कम सुनने वाले व्यक्तियों के लिए महत्वपूर्ण है।", simple: "यह खासकर बहरे लोगों के लिए जरूरी है।" },
    ],
    bengali: [
      { time: 0, standard: "আজ আমরা একটি অত্যন্ত গুরুত্বপূর্ণ বিষয় নিয়ে আলোচনা করব যা ডিজিটাল অন্তর্ভুক্তির সাথে সম্পর্কিত।", simple: "আজ আমরা একটি বিশেষ বিষয় নিয়ে কথা বলব। এটি ডিজিটাল অন্তর্ভুক্তি সম্পর্কে।" },
      { time: 5, standard: "প্রযুক্তি ব্যবহার করে আমরা সমাজের সকল শ্রেণীকে সংযুক্ত করতে পারি।", simple: "প্রযুক্তি দিয়ে আমরা সবাইকে যুক্ত করতে পারি।" },
      { time: 10, standard: "এটি বিশেষভাবে বধির এবং শ্রবণশক্তি কম এমন ব্যক্তিদের জন্য গুরুত্বপূর্ণ।", simple: "এটি বিশেষভাবে বধির মানুষদের জন্য দরকারী।" },
    ],
    tamil: [
      { time: 0, standard: "இன்று நாம் டிஜிட்டல் உள்ளடக்கம் தொடர்பான மிக முக்கியமான விஷயத்தைப் பற்றி விவாதிக்கப் போகிறோம்.", simple: "இன்று நாம் ஒரு முக்கிய விஷயம் பற்றி பேசுவோம். இது டிஜிட்டல் உள்ளடக்கம் பற்றி." },
      { time: 5, standard: "தொழில்நுட்பத்தைப் பயன்படுத்தி சமுதாயத்தின் அனைத்து பிரிவுகளையும் இணைக்க முடியும்.", simple: "தொழில்நுட்பத்தால் நாம் அனைவரையும் இணைக்க முடியும்." },
      { time: 10, standard: "இது குறிப்பாக காது கேளாதவர்கள் மற்றும் குறைவாக கேட்கும் நபர்களுக்கு முக்கியமானது.", simple: "இது குறிப்பாக காது கேளாதவர்களுக்கு முக்கியம்." },
    ],
    telugu: [
      { time: 0, standard: "ఈరోజు మనం డిజిటల్ చేరిక గురించి చాలా ముఖ్యమైన అంశం గురించి చర్చించబోతున్నాం.", simple: "ఈరోజు మనం ఒక ముఖ్యమైన విషయం గురించి మాట్లాడుదాం. ఇది డిజిటల్ చేరిక గురించి." },
      { time: 5, standard: "సాంకేతికతను ఉపయోగించి సమాజంలోని అన్ని వర్గాలను కలుపుకోవచ్చు.", simple: "సాంకేతికతతో మనం అందరినీ కలపవచ్చు." },
      { time: 10, standard: "ఇది ముఖ్యంగా చెవిటివారికి మరియు తక్కువగా వినే వ్యక్తులకు ముఖ్యమైనది.", simple: "ఇది ముఖ్యంగా చెవిటివారికి చాలా అవసరం." },
    ],
    marathi: [
      { time: 0, standard: "आज आपण डिजिटल समावेशाशी संबंधित अत्यंत महत्त्वाच्या विषयावर चर्चा करणार आहोत.", simple: "आज आपण एक महत्त्वाची गोष्ट बोलणार आहोत. ही डिजिटल समावेशाबद्दल आहे." },
      { time: 5, standard: "तंत्रज्ञानाचा वापर करून आपण समाजातील सर्व घटकांना जोडू शकतो.", simple: "तंत्रज्ञानाने आपण सगळ्यांना जोडू शकतो." },
      { time: 10, standard: "हे विशेषतः बहिरे आणि कमी ऐकणाऱ्या व्यक्तींसाठी महत्त्वाचे आहे.", simple: "हे खासकरून बहिऱ्यांसाठी खूप गरजेचे आहे." },
    ],
    malayalam: [
      { time: 0, standard: "ഇന്ന് നമ്മൾ ഡിജിറ്റൽ ഉൾപ്പെടുത്തലുമായി ബന്ധപ്പെട്ട വളരെ പ്രധാനപ്പെട്ട വിഷയത്തെക്കുറിച്ച് ചർച്ച ചെയ്യും.", simple: "ഇന്ന് നമ്മൾ ഒരു പ്രധാന കാര്യം സംസാരിക്കും. ഇത് ഡിജിറ്റൽ ഉൾപ്പെടുത്തലിനെക്കുറിച്ചാണ്." },
      { time: 5, standard: "സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് നമുക്ക് സമൂഹത്തിലെ എല്ലാ വിഭാഗങ്ങളെയും ബന്ധിപ്പിക്കാം.", simple: "സാങ്കേതികവിദ്യ ഉപയോഗിച്ച് നമുക്ക് എല്ലാവരെയും ബന്ധിപ്പിക്കാം." },
      { time: 10, standard: "ഇത് പ്രത്യേകിച്ച് ബധിരരും കേൾവി കുറവുള്ളവരുമായ വ്യക്തികൾക്ക് പ്രധാനമാണ്.", simple: "ഇത് പ്രത്യേകിച്ച് ബധിരർക്ക് വളരെ പ്രധാനമാണ്." },
    ],
  };

  // Simulate real-time caption generation for video
  useEffect(() => {
    if (!isPlaying || activeTab !== 'video') return;

    let captionIndex = 0;
    const captions = demoCaptions[selectedLanguage] || demoCaptions.hindi;

    const interval = setInterval(() => {
      if (captionIndex < captions.length) {
        const caption = captions[captionIndex];
        setCurrentCaption(simplifyMode ? caption.simple : caption.standard);
        captionIndex++;
      } else {
        captionIndex = 0; // Loop
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, selectedLanguage, simplifyMode, activeTab]);

  // Update caption when mic caption changes
  useEffect(() => {
    if (activeTab === 'microphone' && micCaption) {
      setCurrentCaption(micCaption);
    }
  }, [micCaption, activeTab]);

  const handleLoadVideo = () => {
    if (!inputUrl.trim()) return;
    
    setIsLoading(true);
    
    // Extract YouTube video ID
    let videoId = "";
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = inputUrl.match(youtubeRegex);
    
    if (match && match[1]) {
      videoId = match[1];
      setVideoUrl(`https://www.youtube.com/embed/${videoId}`);
    } else {
      setVideoUrl(inputUrl);
    }
    
    setTimeout(() => {
      setIsLoading(false);
      setIsPlaying(true);
    }, 1000);
  };

  const handleMicCaptionReceived = (caption) => {
    setMicCaption(caption);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <Badge className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1">
              Live Demo
            </Badge>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
              Beta Version
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Real-Time Multilingual Captions
          </h1>
          <p className="text-lg text-slate-600">
            Experience AI-powered live captions in your preferred Indian language with simplified text for better comprehension.
          </p>
        </div>

        {/* Mode Selector */}
        <Card className="mb-6 shadow-lg border-0 bg-white">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="video" className="flex items-center gap-2">
                  <VideoIcon className="w-4 h-4" />
                  Video Mode
                </TabsTrigger>
                <TabsTrigger value="microphone" className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  Microphone Mode
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Video URL Input - Only show in video mode */}
        {activeTab === 'video' && (
          <Card className="mb-6 shadow-lg border-0 bg-white">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Label htmlFor="video-url" className="text-sm font-medium text-slate-700 mb-2 block">
                    YouTube Video URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="video-url"
                      type="text"
                      placeholder="Paste YouTube URL here (e.g., https://youtube.com/watch?v=...)"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      onClick={handleLoadVideo} 
                      disabled={!inputUrl.trim() || isLoading}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Loading
                        </>
                      ) : (
                        <>
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Load
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Demo uses simulated captions. In production, this connects to live speech-to-text processing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Display Area */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'video' ? (
              <>
                {/* Video Player */}
                <Card className="shadow-xl border-0 overflow-hidden bg-black">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                      
                      <CaptionDisplay 
                        caption={currentCaption}
                        position={captionPosition}
                        size={captionSize}
                        highContrast={highContrast}
                      />
                    </div>

                    {/* Controls */}
                    <div className="bg-slate-900 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-slate-800"
                            onClick={() => setIsPlaying(!isPlaying)}
                          >
                            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-slate-800"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                          </Button>
                          <span className="text-white text-sm">
                            {isPlaying ? 'Playing' : 'Paused'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-slate-800"
                            onClick={() => setShowSettings(!showSettings)}
                          >
                            <SettingsIcon className="w-5 h-5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="text-white hover:bg-slate-800"
                          >
                            <Maximize2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <>
                {/* Microphone Mode - Caption Display Area */}
                <Card className="shadow-xl border-0 overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
                  <CardContent className="p-0">
                    <div className="relative aspect-video bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
                      <div className="text-center p-8">
                        <Mic className="w-20 h-20 text-white/30 mx-auto mb-4" />
                        <p className="text-white/50 text-lg mb-2">Speak into your microphone</p>
                        <p className="text-white/30 text-sm">Live captions will appear below</p>
                      </div>
                      
                      <CaptionDisplay 
                        caption={currentCaption}
                        position={captionPosition}
                        size={captionSize}
                        highContrast={highContrast}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Microphone Capture Component */}
                <MicrophoneCapture 
                  onCaptionReceived={handleMicCaptionReceived}
                  selectedLanguage={selectedLanguage}
                  simplifyMode={simplifyMode}
                />
              </>
            )}

            {/* Status */}
            <Card className="shadow-lg border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Mode</p>
                    <p className="font-semibold text-slate-900 capitalize">{activeTab}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Language</p>
                    <p className="font-semibold text-slate-900 capitalize">{selectedLanguage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Caption Mode</p>
                    <p className="font-semibold text-slate-900">{simplifyMode ? 'Simplified' : 'Standard'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Latency</p>
                    <p className="font-semibold text-emerald-600">~150ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Panel */}
          <div className="space-y-6">
            <LanguageSelector 
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
            />

            <Card className="shadow-lg border-0">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Type className="w-5 h-5 text-blue-600" />
                    Caption Mode
                  </h3>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <Label htmlFor="simplify" className="font-medium text-slate-900">
                        Simplified Captions
                      </Label>
                      <p className="text-sm text-slate-500">Easier to read and understand</p>
                    </div>
                    <Switch
                      id="simplify"
                      checked={simplifyMode}
                      onCheckedChange={setSimplifyMode}
                    />
                  </div>
                </div>

                <CaptionSettings
                  captionSize={captionSize}
                  onCaptionSizeChange={setCaptionSize}
                  captionPosition={captionPosition}
                  onCaptionPositionChange={setCaptionPosition}
                  highContrast={highContrast}
                  onHighContrastChange={setHighContrast}
                />
              </CardContent>
            </Card>

            {/* Info */}
            <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-emerald-50">
              <CardContent className="p-6">
                <h4 className="font-semibold text-slate-900 mb-3">How it works</h4>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>AI processes live audio in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Transcribes to selected Indian language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Simplifies text for better comprehension</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>Displays with ~150ms latency</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}