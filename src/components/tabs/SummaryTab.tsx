import React from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Tv, Volume2, Subtitles, BookOpen } from 'lucide-react';

interface SummaryTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const SummaryTab: React.FC<SummaryTabProps> = ({ settings, onChange, source }) => {
  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Container Format and Options */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center justify-between">
            <span>Container Format</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
              Standard
            </span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Format:</label>
              <select
                id="select-container"
                value={settings.container}
                onChange={(e) => onChange({ container: e.target.value as 'mp4' | 'mkv' | 'webm' })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="mp4">MP4 (MPEG-4 Part 14) - Maximum Compatibility</option>
                <option value="mkv">MKV (Matroska) - Subtitle & Multi-Audio Rich</option>
                <option value="webm">WebM - Modern Royalty-Free Web Standard</option>
              </select>
            </div>

            {/* Container Specific Options */}
            <div className="pt-2 space-y-2 border-t border-[#343444]">
              <span className="block text-[11px] font-medium text-[#8f8fa4] uppercase tracking-wider">
                Container Options
              </span>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  id="checkbox-web-optimized"
                  type="checkbox"
                  checked={settings.webOptimized}
                  onChange={(e) => onChange({ webOptimized: e.target.checked })}
                  className="rounded bg-[#1b1b22] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-medium text-[#e0e0ec]">Web Optimized</span>
                <span className="text-[11px] text-[#808096]">(Positions 'moov' atom at front for progressive streaming)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer select-none">
                <input
                  id="checkbox-align-av"
                  type="checkbox"
                  checked={settings.alignAvStart}
                  onChange={(e) => onChange({ alignAvStart: e.target.checked })}
                  className="rounded bg-[#1b1b22] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                />
                <span className="font-medium text-[#e0e0ec]">Align A/V Start</span>
                <span className="text-[11px] text-[#808096]">(Trims audio and video to start at exact timestamp)</span>
              </label>

              {settings.container === 'mp4' && (
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    id="checkbox-ipod5g"
                    type="checkbox"
                    checked={settings.ipod5gSupport}
                    onChange={(e) => onChange({ ipod5gSupport: e.target.checked })}
                    className="rounded bg-[#1b1b22] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4 cursor-pointer"
                  />
                  <span className="font-medium text-[#e0e0ec]">iPod 5G Support</span>
                  <span className="text-[11px] text-[#808096]">(Includes legacy atom required by classic iPods)</span>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Active Tracks Summary */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2">
            Tracks & Configuration Summary
          </h3>

          <div className="space-y-3">
            {/* Video summary */}
            <div className="flex items-start space-x-2.5 p-2 bg-[#1c1c24] rounded border border-[#323242]">
              <Tv className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Video:</span>{' '}
                <span className="text-[#a4a4ba]">
                  Codec: <strong className="text-white uppercase">{settings.videoCodec}</strong>,{' '}
                  {settings.qualityType === 'rf' ? `RF ${settings.rf}` : `${settings.avgBitrate} kbps`},{' '}
                  Preset: {settings.encoderPreset},{' '}
                  Resolution: {settings.resolutionLimit === 'none' ? 'Same as source' : `Up to ${settings.resolutionLimit}`},{' '}
                  Framerate: {settings.framerate === 'auto' ? 'Same as source' : `${settings.framerate} fps`}
                  {settings.videoSpeed && settings.videoSpeed !== 1 && (
                    <span className="text-amber-400 font-semibold">
                      , Tốc độ phát: {settings.videoSpeed}x ({settings.videoSpeed > 1 ? 'Tua nhanh' : 'Tua chậm'})
                    </span>
                  )}
                </span>
              </div>
            </div>

            {/* Audio summary */}
            <div className="flex items-start space-x-2.5 p-2 bg-[#1c1c24] rounded border border-[#323242]">
              <Volume2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Audio:</span>{' '}
                <span className="text-[#a4a4ba]">
                  Codec: <strong className="text-white uppercase">{settings.audio.codec}</strong>,{' '}
                  {settings.audio.bitrate} kbps, Mixdown: {settings.audio.mixdown}
                  {settings.audio.gain !== 0 && `, Gain: ${settings.audio.gain > 0 ? '+' : ''}${settings.audio.gain}dB`}
                </span>
              </div>
            </div>

            {/* Subtitles summary */}
            <div className="flex items-start space-x-2.5 p-2 bg-[#1c1c24] rounded border border-[#323242]">
              <Subtitles className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Subtitles:</span>{' '}
                <span className="text-[#a4a4ba]">
                  {source?.subtitles.length 
                    ? `${source.subtitles.length} track(s) detected ${settings.burnSubtitle ? '(Burned in)' : '(Soft subs / passthru)'}` 
                    : 'None selected / Passthru'}
                </span>
              </div>
            </div>

            {/* Chapters summary */}
            <div className="flex items-start space-x-2.5 p-2 bg-[#1c1c24] rounded border border-[#323242]">
              <BookOpen className="w-4 h-4 text-purple-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-white">Chapters:</span>{' '}
                <span className="text-[#a4a4ba]">
                  {source?.chapters.length 
                    ? `${source.chapters.length} chapter markers included` 
                    : '1 continuous chapter'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Source vs Output Comparison Strip */}
      {source && (
        <div className="bg-[#1e1e26] border border-[#343444] rounded-lg p-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px]">
            <div>
              <span className="text-[#8e8ea2] font-semibold block mb-1">INPUT SOURCE:</span>
              <div className="space-y-0.5 text-[#c2c2d4]">
                <div>Name: <span className="text-white">{source.name}</span></div>
                <div>Geometry: {source.width}×{source.height} @ {source.fps} fps ({source.format})</div>
                <div>Audio: {source.audioTracks[0]?.name || 'Standard stereo'}</div>
              </div>
            </div>
            <div>
              <span className="text-[#8e8ea2] font-semibold block mb-1">TARGET TRANSCODE:</span>
              <div className="space-y-0.5 text-[#c2c2d4]">
                <div>Container: <span className="text-white uppercase">.{settings.container}</span></div>
                <div>Encoder: {settings.videoCodec} ({settings.encoderPreset} preset)</div>
                <div>Sound: {settings.audio.codec.toUpperCase()} ({settings.audio.mixdown})</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
