import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Palette, 
  Type,
  Globe,
  Save,
  RotateCcw,
  User
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    // User Profile
    fullName: "",
    email: "",
    organization: "",
    
    // Caption Preferences
    defaultLanguage: "hindi",
    defaultSimplify: true,
    defaultFontSize: 18,
    defaultPosition: "bottom",
    defaultHighContrast: false,
    
    // Notifications
    emailNotifications: true,
    captionQualityAlerts: true,
    systemUpdates: false,
    
    // Appearance
    theme: "light",
    
    // Advanced
    autoStart: false,
    saveHistory: true,
    maxCaptionLength: 100
  });

  const handleSave = () => {
    // In a real app, this would save to backend
    alert("Settings saved successfully!");
  };

  const handleReset = () => {
    setSettings({
      defaultLanguage: "hindi",
      defaultSimplify: true,
      defaultFontSize: 18,
      defaultPosition: "bottom",
      defaultHighContrast: false,
      emailNotifications: true,
      captionQualityAlerts: true,
      systemUpdates: false,
      theme: "light",
      autoStart: false,
      saveHistory: true,
      maxCaptionLength: 100
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200 px-3 py-1">
            Settings
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Preferences & Configuration
          </h1>
          <p className="text-lg text-slate-600">
            Customize your captioning experience and system preferences
          </p>
        </div>

        <div className="space-y-6">
          {/* User Profile */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={settings.fullName}
                    onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="organization">Organization (Optional)</Label>
                <Input
                  id="organization"
                  value={settings.organization}
                  onChange={(e) => setSettings({...settings, organization: e.target.value})}
                  placeholder="Your organization or institution"
                />
              </div>
            </CardContent>
          </Card>

          {/* Caption Preferences */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5 text-emerald-600" />
                Caption Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="mb-3 block">Default Language</Label>
                  <Select 
                    value={settings.defaultLanguage} 
                    onValueChange={(value) => setSettings({...settings, defaultLanguage: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hindi">Hindi (हिन्दी)</SelectItem>
                      <SelectItem value="bengali">Bengali (বাংলা)</SelectItem>
                      <SelectItem value="tamil">Tamil (தமிழ்)</SelectItem>
                      <SelectItem value="telugu">Telugu (తెలుగు)</SelectItem>
                      <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                      <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-3 block">Caption Position</Label>
                  <Select 
                    value={settings.defaultPosition} 
                    onValueChange={(value) => setSettings({...settings, defaultPosition: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="top">Top</SelectItem>
                      <SelectItem value="middle">Middle</SelectItem>
                      <SelectItem value="bottom">Bottom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="mb-3 block">
                  Default Font Size: {settings.defaultFontSize}px
                </Label>
                <Slider
                  value={[settings.defaultFontSize]}
                  onValueChange={(value) => setSettings({...settings, defaultFontSize: value[0]})}
                  min={14}
                  max={32}
                  step={2}
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="simplify" className="font-medium">Enable Simplified Captions</Label>
                    <p className="text-sm text-slate-500">Convert complex text to easy-to-read format</p>
                  </div>
                  <Switch
                    id="simplify"
                    checked={settings.defaultSimplify}
                    onCheckedChange={(checked) => setSettings({...settings, defaultSimplify: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <div>
                    <Label htmlFor="highContrast" className="font-medium">High Contrast Mode</Label>
                    <p className="text-sm text-slate-500">Enhance visibility with stronger colors</p>
                  </div>
                  <Switch
                    id="highContrast"
                    checked={settings.defaultHighContrast}
                    onCheckedChange={(checked) => setSettings({...settings, defaultHighContrast: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="emailNotif" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-slate-500">Receive updates via email</p>
                </div>
                <Switch
                  id="emailNotif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="qualityAlerts" className="font-medium">Caption Quality Alerts</Label>
                  <p className="text-sm text-slate-500">Get notified when caption quality drops</p>
                </div>
                <Switch
                  id="qualityAlerts"
                  checked={settings.captionQualityAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, captionQualityAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="systemUpdates" className="font-medium">System Updates</Label>
                  <p className="text-sm text-slate-500">Notifications about new features and updates</p>
                </div>
                <Switch
                  id="systemUpdates"
                  checked={settings.systemUpdates}
                  onCheckedChange={(checked) => setSettings({...settings, systemUpdates: checked})}
                />
              </div>
            </CardContent>
          </Card>

          {/* Appearance */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="mb-3 block">Theme</Label>
                <Select 
                  value={settings.theme} 
                  onValueChange={(value) => setSettings({...settings, theme: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto (System)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Settings */}
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-slate-600" />
                Advanced Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="autoStart" className="font-medium">Auto-start Captions</Label>
                  <p className="text-sm text-slate-500">Start captioning when video begins</p>
                </div>
                <Switch
                  id="autoStart"
                  checked={settings.autoStart}
                  onCheckedChange={(checked) => setSettings({...settings, autoStart: checked})}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div>
                  <Label htmlFor="saveHistory" className="font-medium">Save Caption History</Label>
                  <p className="text-sm text-slate-500">Keep record of generated captions</p>
                </div>
                <Switch
                  id="saveHistory"
                  checked={settings.saveHistory}
                  onCheckedChange={(checked) => setSettings({...settings, saveHistory: checked})}
                />
              </div>

              <div>
                <Label htmlFor="maxLength">Maximum Caption Length (characters)</Label>
                <Input
                  id="maxLength"
                  type="number"
                  value={settings.maxCaptionLength}
                  onChange={(e) => setSettings({...settings, maxCaptionLength: parseInt(e.target.value)})}
                  min={50}
                  max={200}
                  className="mt-2"
                />
                <p className="text-sm text-slate-500 mt-1">Longer captions will be split automatically</p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to Defaults
            </Button>
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}