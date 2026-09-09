import React from 'react';
import { VideoSource, TranscodePreset } from '../types';
import { formatTime } from '../utils/handbrakeCli';
import { Bookmark, Film, Layers } from 'lucide-react';

interface SourceBarProps {
  source: VideoSource | null;
  currentPreset: TranscodePreset | null;
  onOpenSourceModal: () => void;
  onSaveNewPreset: () => void;
  onSelectPresetId: (id: string) => void;
  presets: TranscodePreset[];
}

export const SourceBar: React.FC<SourceBarProps> = ({
  source,
  currentPreset,
  onOpenSourceModal,
  onSaveNewPreset,
  onSelectPresetId,
  presets
}) => {
  return (
    <div className="bg-[#202028] border-b border-[#363644] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
      {/* Source Selection Details */}
      <div className="flex items-center space-x-3 min-w-0">
        <div className="flex items-center space-x-1.5 text-[#9a9ab0] font-medium shrink-0">
          <Film className="w-4 h-4 text-amber-400" />
          <span>Source:</span>
        </div>

        {source ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <span 
              className="text-white font-semibold truncate max-w-xs cursor-pointer hover:underline"
              onClick={onOpenSourceModal}
              title={source.name}
            >
              {source.name}
            </span>

            <div className="flex items-center space-x-2 text-[11px] text-[#9090a4] bg-[#2a2a36] px-2.5 py-1 rounded border border-[#3c3c4e]">
              <span>Title: <strong className="text-white">1</strong></span>
              <span className="text-[#555566]">|</span>
              <span>Chapters: <strong className="text-white">1 - {source.chapters.length || 1}</strong></span>
              <span className="text-[#555566]">|</span>
              <span>Duration: <strong className="text-emerald-400">{formatTime(source.duration)}</strong></span>
              <span className="text-[#555566]">|</span>
              <span>Res: <strong className="text-white">{source.width}×{source.height}</strong> ({source.fps} fps)</span>
            </div>
          </div>
        ) : (
          <button
            id="sourcebar-open-source"
            onClick={onOpenSourceModal}
            className="text-amber-400 hover:text-amber-300 underline font-medium"
          >
            No source video loaded. Click here to open source...
          </button>
        )}
      </div>

      {/* Preset Quick Selector & Save Preset */}
      <div className="flex items-center space-x-2 shrink-0">
        <div className="flex items-center space-x-1.5 text-[#9a9ab0]">
          <Layers className="w-3.5 h-3.5 text-rose-400" />
          <span>Preset:</span>
        </div>

        <select
          id="preset-quick-select"
          value={currentPreset?.id || ''}
          onChange={(e) => onSelectPresetId(e.target.value)}
          className="bg-[#2b2b38] border border-[#444458] rounded px-2.5 py-1 text-white font-medium focus:outline-hidden focus:border-rose-500 max-w-xs truncate"
        >
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} ({preset.category})
            </option>
          ))}
        </select>

        <button
          id="btn-save-preset"
          onClick={onSaveNewPreset}
          className="flex items-center space-x-1 bg-[#323242] hover:bg-[#3d3d50] active:bg-[#252534] text-[#cfcfe0] hover:text-white border border-[#48485e] px-2.5 py-1 rounded transition-colors text-[11px]"
          title="Save current configuration as a new custom preset"
        >
          <Bookmark className="w-3.5 h-3.5 text-blue-400" />
          <span>Save New Preset</span>
        </button>
      </div>
    </div>
  );
};
