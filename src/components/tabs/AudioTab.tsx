import React from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Volume2, Sliders } from 'lucide-react';

interface AudioTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const AudioTab: React.FC<AudioTabProps> = ({ settings, onChange, source }) => {
  const audio = settings.audio;

  const updateAudio = (changes: Partial<typeof audio>) => {
    onChange({
      audio: {
        ...audio,
        ...changes
      }
    });
  };

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3c3c4e] pb-2">
          <h3 className="font-semibold text-white text-sm flex items-center space-x-1.5">
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>Audio Tracks & Encoders</span>
          </h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => updateAudio({ gain: 0, drc: 0 })}
              className="text-[11px] text-[#8e8ea2] hover:text-white px-2 py-1 bg-[#1b1b22] rounded border border-[#383848]"
            >
              Reset Levels
            </button>
          </div>
        </div>

        {/* Tracks Table */}
        <div className="overflow-x-auto border border-[#383848] rounded bg-[#181822]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#20202c] border-b border-[#323242] text-[11px] text-[#8e8ea4]">
                <th className="p-2.5">Track #</th>
                <th className="p-2.5">Source Audio</th>
                <th className="p-2.5">Codec</th>
                <th className="p-2.5">Mixdown</th>
                <th className="p-2.5">Bitrate</th>
                <th className="p-2.5">Sample Rate</th>
                <th className="p-2.5">Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a38]">
              <tr className="hover:bg-[#20202e] transition-colors">
                <td className="p-2.5 font-mono text-rose-400 font-bold">1</td>
                <td className="p-2.5 font-medium text-white">
                  {source?.audioTracks[0]?.name || 'Track 1 (Default Audio)'}
                </td>
                <td className="p-2.5">
                  <select
                    value={audio.codec}
                    onChange={(e) => updateAudio({ codec: e.target.value as any })}
                    className="bg-[#272736] border border-[#444458] rounded px-2 py-1 text-white font-medium"
                  >
                    <option value="aac">AAC (avcodec)</option>
                    <option value="ac3">AC3 (Dolby Digital)</option>
                    <option value="mp3">MP3 (LAME)</option>
                    <option value="opus">Opus (High Efficiency)</option>
                    <option value="flac">FLAC 16-bit (Lossless)</option>
                    <option value="passthru">Auto Passthru (Copy)</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select
                    value={audio.mixdown}
                    disabled={audio.codec === 'passthru'}
                    onChange={(e) => updateAudio({ mixdown: e.target.value as any })}
                    className="bg-[#272736] border border-[#444458] rounded px-2 py-1 text-white disabled:opacity-40"
                  >
                    <option value="stereo">Stereo</option>
                    <option value="mono">Mono</option>
                    <option value="5.1">5.1 Channels</option>
                    <option value="dpl2">Dolby Pro Logic II</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select
                    value={audio.bitrate}
                    disabled={audio.codec === 'passthru' || audio.codec === 'flac'}
                    onChange={(e) => updateAudio({ bitrate: parseInt(e.target.value) })}
                    className="bg-[#272736] border border-[#444458] rounded px-2 py-1 text-white disabled:opacity-40"
                  >
                    <option value="64">64 kbps</option>
                    <option value="96">96 kbps</option>
                    <option value="128">128 kbps</option>
                    <option value="160">160 kbps</option>
                    <option value="192">192 kbps</option>
                    <option value="256">256 kbps</option>
                    <option value="320">320 kbps</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <select
                    value={audio.sampleRate}
                    disabled={audio.codec === 'passthru'}
                    onChange={(e) => updateAudio({ sampleRate: e.target.value as any })}
                    className="bg-[#272736] border border-[#444458] rounded px-2 py-1 text-white disabled:opacity-40"
                  >
                    <option value="auto">Auto</option>
                    <option value="44.1">44.1 kHz</option>
                    <option value="48">48 kHz</option>
                  </select>
                </td>
                <td className="p-2.5">
                  <span className={`font-mono ${audio.gain !== 0 ? 'text-amber-400 font-bold' : 'text-[#88889a]'}`}>
                    {audio.gain > 0 ? `+${audio.gain}` : audio.gain} dB
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Gain & DRC Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <div className="bg-[#1b1b22] border border-[#343444] rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#9a9ab0] font-medium flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                <span>Gain Adjustment:</span>
              </span>
              <span className="font-mono text-emerald-400 font-bold">
                {audio.gain > 0 ? `+${audio.gain}` : audio.gain} dB
              </span>
            </div>
            <input
              type="range"
              min="-20"
              max="20"
              step="1"
              value={audio.gain}
              onChange={(e) => updateAudio({ gain: parseInt(e.target.value) })}
              className="w-full accent-emerald-500 cursor-pointer h-2 bg-[#2d2d3c] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#707084]">
              <span>-20 dB (Quieter)</span>
              <span>0 dB (Unchanged)</span>
              <span>+20 dB (Louder)</span>
            </div>
          </div>

          <div className="bg-[#1b1b22] border border-[#343444] rounded p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[#9a9ab0] font-medium flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Dynamic Range Compression (DRC):</span>
              </span>
              <span className="font-mono text-purple-400 font-bold">
                {audio.drc > 0 ? audio.drc.toFixed(1) : 'Off'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={audio.drc}
              onChange={(e) => updateAudio({ drc: parseFloat(e.target.value) })}
              className="w-full accent-purple-500 cursor-pointer h-2 bg-[#2d2d3c] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#707084]">
              <span>0.0 (Off / Native)</span>
              <span>1.5 (Moderate)</span>
              <span>3.0 (Maximum speech boost)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
