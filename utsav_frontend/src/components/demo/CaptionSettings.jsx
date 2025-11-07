import React from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CaptionSettings({
  captionSize,
  onCaptionSizeChange,
  captionPosition,
  onCaptionPositionChange,
  highContrast,
  onHighContrastChange
}) {
  return (
    <div className="space-y-6">
      <div>
        <Label className="text-sm font-medium text-slate-700 mb-3 block">
          Font Size: {captionSize}px
        </Label>
        <Slider
          value={[captionSize]}
          onValueChange={(value) => onCaptionSizeChange(value[0])}
          min={14}
          max={32}
          step={2}
          className="w-full"
        />
      </div>

      <div>
        <Label className="text-sm font-medium text-slate-700 mb-3 block">
          Caption Position
        </Label>
        <Select value={captionPosition} onValueChange={onCaptionPositionChange}>
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

      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
        <div>
          <Label htmlFor="contrast" className="font-medium text-slate-900">
            High Contrast
          </Label>
          <p className="text-sm text-slate-500">Better visibility</p>
        </div>
        <Switch
          id="contrast"
          checked={highContrast}
          onCheckedChange={onHighContrastChange}
        />
      </div>
    </div>
  );
}