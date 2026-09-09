import React from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Crop, Maximize } from 'lucide-react';

interface DimensionsTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const DimensionsTab: React.FC<DimensionsTabProps> = ({ settings, onChange, source }) => {
  const sourceWidth = source?.width || 1920;
  const sourceHeight = source?.height || 1080;

  // Compute effective output resolution after limit
  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;

  if (settings.resolutionLimit === '720p') {
    if (targetHeight > 720) {
      targetWidth = Math.round((720 * sourceWidth) / sourceHeight);
      targetHeight = 720;
    }
  } else if (settings.resolutionLimit === '1080p') {
    if (targetHeight > 1080) {
      targetWidth = Math.round((1080 * sourceWidth) / sourceHeight);
      targetHeight = 1080;
    }
  } else if (settings.resolutionLimit === '480p') {
    if (targetHeight > 480) {
      targetWidth = Math.round((480 * sourceWidth) / sourceHeight);
      targetHeight = 480;
    }
  }

  // Account for custom cropping
  const croppedWidth = targetWidth - (settings.cropping === 'custom' ? (settings.cropValues.left + settings.cropValues.right) : 0);
  const croppedHeight = targetHeight - (settings.cropping === 'custom' ? (settings.cropValues.top + settings.cropValues.bottom) : 0);

  const handleCropChange = (side: 'top' | 'bottom' | 'left' | 'right', val: number) => {
    onChange({
      cropValues: {
        ...settings.cropValues,
        [side]: Math.max(0, val)
      }
    });
  };

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Resolution & Geometry */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Maximize className="w-4 h-4 text-blue-400" />
            <span>Resolution & Scaling</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Resolution Limit:</label>
              <select
                id="select-resolution-limit"
                value={settings.resolutionLimit}
                onChange={(e) => onChange({ resolutionLimit: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="none">None (No Resolution Constraint)</option>
                <option value="2160p">4K UHD (2160p)</option>
                <option value="1080p">1080p Full HD (1920x1080)</option>
                <option value="720p">720p HD (1280x720)</option>
                <option value="480p">480p Standard Definition</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Anamorphic Mode:</label>
              <select
                id="select-anamorphic"
                value={settings.anamorphic}
                onChange={(e) => onChange({ anamorphic: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="auto">Automatic (Maintain Source Display Aspect Ratio)</option>
                <option value="loose">Loose (Constrain to mod 16 width/height)</option>
                <option value="none">None (Strict Pixel Aspect Ratio 1:1)</option>
              </select>
            </div>

            {/* Geometry Display Box */}
            <div className="p-3 bg-[#191921] border border-[#323240] rounded text-[11px] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#8e8ea2]">Source Dimensions:</span>
                <span className="font-mono text-white">{sourceWidth} × {sourceHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8ea2]">Target Storage Size:</span>
                <span className="font-mono text-emerald-400 font-semibold">{croppedWidth} × {croppedHeight}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e8ea2]">Aspect Ratio:</span>
                <span className="font-mono text-white">{(croppedWidth / croppedHeight).toFixed(2)} : 1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Cropping Controls */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Crop className="w-4 h-4 text-amber-400" />
            <span>Cropping</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="cropping"
                  checked={settings.cropping === 'auto'}
                  onChange={() => onChange({ cropping: 'auto' })}
                  className="text-rose-600 focus:ring-0"
                />
                <span>Automatic (Detect Black Letterbox Bars)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="cropping"
                  checked={settings.cropping === 'custom'}
                  onChange={() => onChange({ cropping: 'custom' })}
                  className="text-rose-600 focus:ring-0"
                />
                <span>Custom</span>
              </label>
            </div>

            {/* Custom Crop Inputs in a compass cross layout */}
            <div className={`pt-2 transition-opacity ${settings.cropping === 'custom' ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <div className="flex flex-col items-center space-y-2">
                {/* Top */}
                <div className="flex items-center space-x-2">
                  <span className="text-[#8a8a9c] w-12 text-right">Top:</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="2"
                    value={settings.cropValues.top}
                    onChange={(e) => handleCropChange('top', parseInt(e.target.value) || 0)}
                    className="w-20 bg-[#1b1b22] border border-[#444458] rounded px-2 py-1 text-center text-white"
                  />
                  <span className="text-[#666678]">px</span>
                </div>

                {/* Left & Right */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#8a8a9c] w-12 text-right">Left:</span>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="2"
                      value={settings.cropValues.left}
                      onChange={(e) => handleCropChange('left', parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#1b1b22] border border-[#444458] rounded px-2 py-1 text-center text-white"
                    />
                    <span className="text-[#666678]">px</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[#8a8a9c] w-12 text-right">Right:</span>
                    <input
                      type="number"
                      min="0"
                      max="500"
                      step="2"
                      value={settings.cropValues.right}
                      onChange={(e) => handleCropChange('right', parseInt(e.target.value) || 0)}
                      className="w-20 bg-[#1b1b22] border border-[#444458] rounded px-2 py-1 text-center text-white"
                    />
                    <span className="text-[#666678]">px</span>
                  </div>
                </div>

                {/* Bottom */}
                <div className="flex items-center space-x-2">
                  <span className="text-[#8a8a9c] w-12 text-right">Bottom:</span>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    step="2"
                    value={settings.cropValues.bottom}
                    onChange={(e) => handleCropChange('bottom', parseInt(e.target.value) || 0)}
                    className="w-20 bg-[#1b1b22] border border-[#444458] rounded px-2 py-1 text-center text-white"
                  />
                  <span className="text-[#666678]">px</span>
                </div>
              </div>
            </div>

            {/* Visual Aspect Box */}
            <div className="mt-4 flex flex-col items-center justify-center p-3 bg-[#181820] border border-[#30303e] rounded">
              <span className="text-[10px] text-[#78788a] mb-2 uppercase tracking-wide">Frame Geometry Preview</span>
              <div className="w-56 h-32 bg-[#2c2c38] border-2 border-dashed border-[#55556a] relative flex items-center justify-center rounded">
                {/* Visual crop border */}
                <div 
                  className="bg-rose-950/40 border border-rose-500 flex items-center justify-center transition-all"
                  style={{
                    width: `${Math.max(40, 100 - ((settings.cropValues.left + settings.cropValues.right) / 10))}%`,
                    height: `${Math.max(30, 100 - ((settings.cropValues.top + settings.cropValues.bottom) / 10))}%`,
                  }}
                >
                  <span className="text-[11px] font-mono text-rose-300 font-medium">
                    {croppedWidth}×{croppedHeight}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
