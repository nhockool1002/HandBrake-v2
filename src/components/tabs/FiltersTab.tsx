import React from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Sparkles, Sliders } from 'lucide-react';

interface FiltersTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const FiltersTab: React.FC<FiltersTabProps> = ({ settings, onChange }) => {
  const filterState = settings.filters;

  const updateFilters = (changes: Partial<typeof filterState>) => {
    onChange({
      filters: {
        ...filterState,
        ...changes
      }
    });
  };

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Restoration & Interlacing */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span>Interlacing & Artifact Removal</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Deinterlace / Decomb:</label>
              <select
                id="select-deinterlace"
                value={filterState.deinterlace}
                onChange={(e) => updateFilters({ deinterlace: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off (Progressive Source)</option>
                <option value="decomb">Decomb (Recommended - Detects combed frames automatically)</option>
                <option value="yadif">Yadif (Standard motion-adaptive deinterlacer)</option>
                <option value="bwdif">Bwdif (Bob Weaver Deinterlacing Filter)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Detelecine:</label>
              <select
                id="select-detelecine"
                value={filterState.detelecine}
                onChange={(e) => updateFilters({ detelecine: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off</option>
                <option value="default">Default (Reverses 3:2 pull-down telecine)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Denoise:</label>
              <select
                id="select-denoise"
                value={filterState.denoise}
                onChange={(e) => updateFilters({ denoise: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off</option>
                <option value="nlmeans">NLMeans (Non-Local Means - High Quality)</option>
                <option value="hqdn3d">HQDN3D (High Quality 3D Denoise - Fast)</option>
              </select>
            </div>

            {filterState.denoise !== 'off' && (
              <div className="pl-3 border-l-2 border-rose-500/50 space-y-1">
                <label className="block text-[#8f8fa2] font-medium">Denoise Preset:</label>
                <select
                  value={filterState.denoisePreset}
                  onChange={(e) => updateFilters({ denoisePreset: e.target.value as any })}
                  className="w-full bg-[#181820] border border-[#3e3e50] rounded px-2.5 py-1 text-white"
                >
                  <option value="film">Film (Preserve fine organic grain)</option>
                  <option value="grain">Grain (Aggressive film grain preservation)</option>
                  <option value="animation">Animation (Clean flat color surfaces)</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Enhancement & Sharpening */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Image Enhancement</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Sharpen:</label>
              <select
                id="select-sharpen"
                value={filterState.sharpen}
                onChange={(e) => updateFilters({ sharpen: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off</option>
                <option value="lapsharp">LapSharp (Laplacian edge sharpening)</option>
                <option value="unsharp">Unsharp (Classic unsharp mask)</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Chroma Smooth:</label>
              <select
                id="select-chroma"
                value={filterState.chromaSmooth}
                onChange={(e) => updateFilters({ chromaSmooth: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off</option>
                <option value="light">Light (Removes VHS/analog chroma bleeding)</option>
                <option value="medium">Medium</option>
                <option value="strong">Strong</option>
              </select>
            </div>

            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Deband:</label>
              <select
                id="select-deband"
                value={filterState.deband}
                onChange={(e) => updateFilters({ deband: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="off">Off</option>
                <option value="light">Light (Smooths 8-bit color banding in skies/gradients)</option>
                <option value="medium">Medium</option>
              </select>
            </div>

            <div className="pt-2 border-t border-[#343444]">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  id="checkbox-grayscale"
                  type="checkbox"
                  checked={filterState.grayscale}
                  onChange={(e) => updateFilters({ grayscale: e.target.checked })}
                  className="rounded bg-[#1b1b22] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-semibold text-white">Grayscale</span>
                <span className="text-[11px] text-[#808096]">(Discards chroma planes entirely for black & white video)</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
