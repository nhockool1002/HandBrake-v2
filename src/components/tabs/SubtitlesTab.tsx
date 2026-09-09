import React, { useRef } from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Subtitles, Plus, FileText } from 'lucide-react';

interface SubtitlesTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const SubtitlesTab: React.FC<SubtitlesTabProps> = ({ settings, onChange, source }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportSrt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && source) {
      const newSub = {
        id: (source.subtitles.length || 0) + 1,
        language: file.name.replace(/\.[^/.]+$/, ''),
        format: 'SubRip (SRT external)',
        isDefault: true,
        isForced: false
      };
      source.subtitles.push(newSub);
      onChange({ selectedSubtitleId: newSub.id });
    }
  };

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3c3c4e] pb-2">
          <h3 className="font-semibold text-white text-sm flex items-center space-x-1.5">
            <Subtitles className="w-4 h-4 text-amber-400" />
            <span>Subtitle Tracks & Burn-in Options</span>
          </h3>

          <div className="flex items-center space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".srt,.vtt"
              className="hidden"
              onChange={handleImportSrt}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1.5 text-[11px] text-white bg-[#323242] hover:bg-[#3e3e50] px-2.5 py-1 rounded border border-[#48485e]"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span>Add External SRT...</span>
            </button>
          </div>
        </div>

        {/* Subtitles Table */}
        {source && source.subtitles.length > 0 ? (
          <div className="overflow-x-auto border border-[#383848] rounded bg-[#181822]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#20202c] border-b border-[#323242] text-[11px] text-[#8e8ea4]">
                  <th className="p-2.5">Track #</th>
                  <th className="p-2.5">Language / Name</th>
                  <th className="p-2.5">Format</th>
                  <th className="p-2.5">Burn-in Video</th>
                  <th className="p-2.5">Forced Only</th>
                  <th className="p-2.5">Default</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a38]">
                {source.subtitles.map((sub) => {
                  const isSelected = settings.selectedSubtitleId === sub.id;
                  return (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-[#20202e] transition-colors ${isSelected ? 'bg-[#252535]' : ''}`}
                    >
                      <td className="p-2.5 font-mono text-amber-400 font-bold">{sub.id}</td>
                      <td className="p-2.5 font-medium text-white flex items-center space-x-2">
                        <FileText className="w-3.5 h-3.5 text-[#88889a]" />
                        <span>{sub.language}</span>
                      </td>
                      <td className="p-2.5 text-[#9a9ab0]">{sub.format}</td>
                      <td className="p-2.5">
                        <input
                          type="checkbox"
                          checked={isSelected && settings.burnSubtitle}
                          onChange={(e) => {
                            onChange({
                              selectedSubtitleId: sub.id,
                              burnSubtitle: e.target.checked
                            });
                          }}
                          className="rounded bg-[#262632] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="checkbox"
                          checked={sub.isForced}
                          onChange={() => {}}
                          className="rounded bg-[#262632] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="radio"
                          name="default-sub"
                          checked={isSelected}
                          onChange={() => onChange({ selectedSubtitleId: sub.id })}
                          className="text-rose-600 focus:ring-0 cursor-pointer"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#1a1a24] rounded border border-dashed border-[#383848] text-[#8e8ea2]">
            <Subtitles className="w-8 h-8 text-[#555568] mx-auto mb-2" />
            <p>No subtitle tracks present in source file.</p>
            <p className="text-[11px] text-[#6d6d80] mt-1">You can add an external .srt or .vtt subtitle file using the button above.</p>
          </div>
        )}

        <div className="p-3 bg-[#191922] border border-[#323242] rounded text-[11px] text-[#8e8ea2]">
          <strong className="text-white">Note on Burn-in:</strong> Burning in subtitles will render text permanently onto the video frames. If unselected, subtitles will be multiplexed as soft selectable subtitle tracks (supported in MP4 and MKV).
        </div>
      </div>
    </div>
  );
};
