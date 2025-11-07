import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: "hindi", name: "Hindi", native: "हिन्दी" },
  { code: "bengali", name: "Bengali", native: "বাংলা" },
  { code: "tamil", name: "Tamil", native: "தமிழ்" },
  { code: "telugu", name: "Telugu", native: "తెలుగు" },
  { code: "marathi", name: "Marathi", native: "मराठी" },
  { code: "malayalam", name: "Malayalam", native: "മലയാളം" },
  { code: "kannada", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "gujarati", name: "Gujarati", native: "ગુજરાતી" },
  { code: "odia", name: "Odia", native: "ଓଡ଼ିଆ" },
];

export default function LanguageSelector({ selectedLanguage, onLanguageChange }) {
  return (
    <Card className="shadow-lg border-0">
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
          <Languages className="w-5 h-5 text-blue-600" />
          Caption Language
        </h3>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center justify-between w-full gap-3">
                  <span>{lang.name}</span>
                  <span className="text-slate-500 text-sm">{lang.native}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}