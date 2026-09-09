import React from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { Gauge, Sliders, Settings2, FastForward, Rewind, RotateCcw, Volume2, Clock, Info } from 'lucide-react';
import { formatTime } from '../../utils/handbrakeCli';

interface VideoTabProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

const PRESET_SPEEDS = [
  'ultrafast',
  'superfast',
  'veryfast',
  'faster',
  'fast',
  'medium',
  'slow',
  'slower',
  'veryslow'
] as const;

const PLAYBACK_SPEED_PRESETS = [
  { value: 0.25, label: '0.25x', desc: 'Chậm 4x' },
  { value: 0.5, label: '0.5x', desc: 'Chậm 2x' },
  { value: 0.75, label: '0.75x', desc: 'Chậm 0.75x' },
  { value: 1.0, label: '1.0x', desc: 'Chuẩn 1x' },
  { value: 1.25, label: '1.25x', desc: 'Nhanh 1.25x' },
  { value: 1.5, label: '1.5x', desc: 'Nhanh 1.5x' },
  { value: 2.0, label: '2.0x', desc: 'Nhanh 2x' },
  { value: 4.0, label: '4.0x', desc: 'Nhanh 4x' },
];

export const VideoTab: React.FC<VideoTabProps> = ({ settings, onChange, source }) => {
  const currentSpeedIdx = PRESET_SPEEDS.indexOf(settings.encoderPreset as any) !== -1 
    ? PRESET_SPEEDS.indexOf(settings.encoderPreset as any) 
    : 4;

  const currentSpeed = settings.speed || 1.0;
  const originalDuration = source?.duration || 0;
  const targetDuration = originalDuration > 0 ? originalDuration / currentSpeed : 0;

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Codec & Framerate */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span>Video Codec & Framerate</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[#9a9ab0] mb-1 font-medium">Video Encoder:</label>
              <select
                id="select-video-codec"
                value={settings.videoCodec}
                onChange={(e) => onChange({ videoCodec: e.target.value as any })}
                className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white focus:outline-hidden focus:border-rose-500 font-medium"
              >
                <option value="x264">H.264 (x264) - Broadest hardware & player compatibility</option>
                <option value="x265">H.265 / HEVC (x265) - 50% better compression efficiency</option>
                <option value="svt-av1">AV1 (SVT-AV1) - Next-gen open standard</option>
                <option value="vp9">VP9 - Royalty-free Google WebM standard</option>
                <option value="mpeg4">MPEG-4 - Legacy device compatibility</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#9a9ab0] mb-1 font-medium">Framerate (FPS):</label>
                <select
                  id="select-framerate"
                  value={settings.framerate}
                  onChange={(e) => onChange({ framerate: e.target.value === 'auto' ? 'auto' : Number(e.target.value) })}
                  className="w-full bg-[#1b1b22] border border-[#444458] rounded px-2.5 py-1.5 text-white"
                >
                  <option value="auto">Peak Framerate (Same as Source)</option>
                  <option value="60">60 fps (Smooth / Gaming)</option>
                  <option value="50">50 fps (PAL High)</option>
                  <option value="30">30 fps</option>
                  <option value="29.97">29.97 fps (NTSC)</option>
                  <option value="25">25 fps (PAL / Film)</option>
                  <option value="24">24 fps (Cinema Standard)</option>
                  <option value="23.976">23.976 fps</option>
                </select>
              </div>

              <div>
                <label className="block text-[#9a9ab0] mb-1 font-medium">Framerate Mode:</label>
                <div className="space-y-1 mt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="fpsMode"
                      checked={settings.fpsMode === 'vfr'}
                      onChange={() => onChange({ fpsMode: 'vfr' })}
                      className="text-rose-600 focus:ring-0"
                    />
                    <span>Peak Framerate (VFR)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="fpsMode"
                      checked={settings.fpsMode === 'cfr'}
                      onChange={() => onChange({ fpsMode: 'cfr' })}
                      className="text-rose-600 focus:ring-0"
                    />
                    <span>Constant Framerate (CFR)</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Rate Control (Quality vs Bitrate) */}
        <div className="space-y-4 bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs">
          <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>Quality & Rate Control</span>
          </h3>

          <div className="space-y-4">
            {/* Mode selector */}
            <div className="flex items-center space-x-5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="qualityType"
                  checked={settings.qualityType === 'rf'}
                  onChange={() => onChange({ qualityType: 'rf' })}
                  className="text-rose-600 focus:ring-0"
                />
                <span className="font-medium text-white">Constant Quality (RF)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="qualityType"
                  checked={settings.qualityType === 'bitrate'}
                  onChange={() => onChange({ qualityType: 'bitrate' })}
                  className="text-rose-600 focus:ring-0"
                />
                <span className="font-medium text-white">Average Bitrate (kbps)</span>
              </label>
            </div>

            {settings.qualityType === 'rf' ? (
              <div className="space-y-2 bg-[#1b1b22] border border-[#363646] rounded p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#8e8ea2]">RF Value:</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-lg font-bold text-rose-400">{settings.rf} RF</span>
                    <span className="text-[10px] text-[#8e8ea2]">
                      {settings.rf <= 18 ? '(Near Lossless)' : settings.rf <= 22 ? '(Standard High Def)' : '(High Compression)'}
                    </span>
                  </div>
                </div>

                {/* RF Slider */}
                <input
                  id="range-rf-slider"
                  type="range"
                  min="0"
                  max="51"
                  step="0.5"
                  value={settings.rf}
                  onChange={(e) => onChange({ rf: parseFloat(e.target.value) })}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-[#2d2d3c] rounded-lg"
                />

                <div className="flex justify-between text-[10px] text-[#707084]">
                  <span>51 (Lower Quality / Tiny)</span>
                  <span className="text-amber-400 font-medium">Recommended: 20 - 24</span>
                  <span>0 (Lossless / Massive)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-[#1b1b22] border border-[#363646] rounded p-3">
                <div className="flex items-center space-x-3">
                  <label className="text-[#8e8ea2] font-medium">Bitrate:</label>
                  <input
                    id="input-bitrate"
                    type="number"
                    min="500"
                    max="50000"
                    step="100"
                    value={settings.avgBitrate}
                    onChange={(e) => onChange({ avgBitrate: parseInt(e.target.value) || 2000 })}
                    className="w-28 bg-[#262632] border border-[#444458] rounded px-2.5 py-1 text-white font-mono"
                  />
                  <span className="text-[#8e8ea2]">kbps</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#30303e]">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.twoPass}
                      onChange={(e) => onChange({ twoPass: e.target.checked })}
                      className="rounded bg-[#262632] border-[#444458] text-rose-600 focus:ring-0"
                    />
                    <span>2-Pass Encoding (Optimizes rate distribution)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer pl-4">
                    <input
                      type="checkbox"
                      checked={settings.turboFirstPass}
                      onChange={(e) => onChange({ turboFirstPass: e.target.checked })}
                      disabled={!settings.twoPass}
                      className="rounded bg-[#262632] border-[#444458] text-rose-600 focus:ring-0"
                    />
                    <span className={settings.twoPass ? 'text-[#c0c0ce]' : 'text-[#666678]'}>
                      Turbo First Pass (Accelerates pass 1 analysis)
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Video Speed & Playback (Tua Nhanh / Tua Chậm) */}
      <div className="bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#3c3c4e] pb-2">
          <div className="flex items-center space-x-2">
            <FastForward className="w-4 h-4 text-amber-400" />
            <h3 className="font-semibold text-white text-sm">
              Tua Nhanh / Tua Chậm (Video Speed & Time Scaling)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            {currentSpeed === 1.0 ? (
              <span className="px-2.5 py-0.5 rounded text-[11px] bg-[#323242] text-[#9a9ab0] font-medium border border-[#444458]">
                1.0x (Tốc độ chuẩn)
              </span>
            ) : currentSpeed > 1.0 ? (
              <span className="px-2.5 py-0.5 rounded text-[11px] bg-amber-950/70 border border-amber-500/60 text-amber-300 font-semibold flex items-center space-x-1">
                <FastForward className="w-3 h-3" />
                <span>Tua nhanh {currentSpeed.toFixed(2)}x (Tăng tốc)</span>
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded text-[11px] bg-blue-950/70 border border-blue-500/60 text-blue-300 font-semibold flex items-center space-x-1">
                <Rewind className="w-3 h-3" />
                <span>Tua chậm {currentSpeed.toFixed(2)}x (Slow-motion)</span>
              </span>
            )}

            {currentSpeed !== 1.0 && (
              <button
                type="button"
                onClick={() => onChange({ speed: 1.0 })}
                className="flex items-center space-x-1 px-2 py-0.5 rounded bg-[#323242] hover:bg-[#3e3e52] text-[#c0c0d4] hover:text-white border border-[#444458] text-[11px] transition-colors"
                title="Đặt lại về tốc độ bình thường 1.0x"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Đặt lại 1.0x</span>
              </button>
            )}
          </div>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="block text-[#9a9ab0] mb-1.5 font-medium">Mức tốc độ nhanh (Quick Presets):</label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {PLAYBACK_SPEED_PRESETS.map((preset) => {
              const isSelected = Math.abs(currentSpeed - preset.value) < 0.001;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChange({ speed: preset.value })}
                  className={`py-1.5 px-2 rounded text-center border transition-all ${
                    isSelected
                      ? 'bg-amber-600 text-white border-amber-400 font-bold shadow-xs'
                      : 'bg-[#1b1b22] hover:bg-[#282834] text-[#c0c0d4] border-[#3e3e50]'
                  }`}
                >
                  <div className="font-mono text-xs">{preset.label}</div>
                  <div className="text-[10px] opacity-75 truncate">{preset.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Continuous Slider & Manual Input */}
        <div className="space-y-2 bg-[#1b1b22] border border-[#363646] rounded p-3">
          <div className="flex items-center justify-between">
            <span className="text-[#9a9ab0] font-medium">Điều chỉnh tốc độ mượt (0.25x - 4.00x):</span>
            <div className="flex items-center space-x-2">
              <input
                id="input-speed-multiplier"
                type="number"
                min="0.25"
                max="8.0"
                step="0.05"
                value={currentSpeed}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    onChange({ speed: Math.min(8, Math.max(0.1, val)) });
                  }
                }}
                className="w-20 bg-[#262632] border border-[#444458] rounded px-2 py-0.5 text-right font-mono text-white text-xs font-bold"
              />
              <span className="text-amber-400 font-mono font-bold">x</span>
            </div>
          </div>

          <input
            id="range-speed-slider"
            type="range"
            min="0.25"
            max="4.0"
            step="0.05"
            value={currentSpeed}
            onChange={(e) => onChange({ speed: parseFloat(e.target.value) })}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-[#2d2d3c] rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-[#707084] font-mono">
            <span>0.25x (Chậm nhất)</span>
            <span>0.5x</span>
            <span className="text-white font-bold">1.0x (Chuẩn)</span>
            <span>2.0x</span>
            <span>4.0x (Nhanh nhất)</span>
          </div>
        </div>

        {/* Live Duration Simulation & Audio Pitch Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Duration info */}
          <div className="bg-[#1b1b22] border border-[#363646] rounded p-3 flex items-start space-x-2.5">
            <Clock className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <div className="font-medium text-white text-xs">Thời lượng ước tính:</div>
              {originalDuration > 0 ? (
                <div className="text-[11px] text-[#c0c0d2] space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#88889c]">Gốc:</span>
                    <span className="font-mono text-white">{formatTime(originalDuration)}</span>
                    <span className="text-[#88889c]">➔</span>
                    <span className="text-[#88889c]">Sau tua:</span>
                    <span className="font-mono text-emerald-400 font-bold">{formatTime(targetDuration)}</span>
                  </div>
                  <div className="text-[10px] text-[#88889c]">
                    {currentSpeed > 1.0
                      ? `Rút ngắn ${((1 - 1 / currentSpeed) * 100).toFixed(0)}% thời gian phát video`
                      : currentSpeed < 1.0
                      ? `Kéo dài thêm ${((1 / currentSpeed - 1) * 100).toFixed(0)}% thời gian phát video`
                      : 'Thời lượng không đổi'}
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-[#88889c]">
                  Hãy mở một video nguồn để xem tính toán thời lượng sau khi tua
                </div>
              )}
            </div>
          </div>

          {/* Audio Pitch & Scaling Mode */}
          <div className="bg-[#1b1b22] border border-[#363646] rounded p-3 space-y-2.5">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.pitchCorrection}
                onChange={(e) => onChange({ pitchCorrection: e.target.checked })}
                className="rounded bg-[#262632] border-[#444458] text-amber-500 focus:ring-0 mt-0.5"
              />
              <div>
                <span className="font-medium text-white text-xs flex items-center space-x-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Bảo toàn cao độ âm thanh (Keep Audio Pitch)</span>
                </span>
                <p className="text-[10px] text-[#88889c] mt-0.5">
                  Giữ giọng nói tự nhiên, không bị méo giọng the thé (chipmunk) hoặc ồm ồm khi thay đổi tốc độ
                </p>
              </div>
            </label>

            <div className="pt-2 border-t border-[#2e2e3c] flex items-center justify-between text-[11px]">
              <span className="text-[#88889c]">Phương thức tua:</span>
              <select
                value={settings.speedMode || 'pts'}
                onChange={(e) => onChange({ speedMode: e.target.value as any })}
                className="bg-[#262632] border border-[#444458] rounded px-2 py-0.5 text-white text-[11px]"
              >
                <option value="pts">PTS (Presentation Time Stamp) - Mượt mà</option>
                <option value="drop_dup">Drop/Duplicate Frames - Giật ngắt quãng</option>
              </select>
            </div>
          </div>
        </div>

        {/* Technical Notice */}
        <div className="bg-[#1e1e28] border border-[#323242] rounded px-3 py-2 flex items-center space-x-2 text-[11px] text-[#9090a6]">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Tính năng tua video sử dụng bộ lọc thời gian <code className="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">setpts</code> và bộ lọc âm thanh <code className="text-amber-300 font-mono bg-black/40 px-1 py-0.5 rounded">atempo</code>. Bạn cũng có thể xem thử trực tiếp trong cửa sổ <strong>Preview</strong>.
          </span>
        </div>
      </div>

      {/* Bottom Section: Encoder Presets, Tuning & Options */}
      <div className="bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs space-y-4">
        <h3 className="font-semibold text-white text-sm border-b border-[#3c3c4e] pb-2 flex items-center space-x-1.5">
          <Settings2 className="w-4 h-4 text-purple-400" />
          <span>Advanced Encoder Options</span>
        </h3>

        {/* Speed / Efficiency Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#9a9ab0] font-medium">Encoder Preset (Speed vs Efficiency):</span>
            <span className="text-rose-400 font-mono font-bold uppercase">{settings.encoderPreset}</span>
          </div>

          <input
            id="range-encoder-preset"
            type="range"
            min="0"
            max={PRESET_SPEEDS.length - 1}
            step="1"
            value={currentSpeedIdx}
            onChange={(e) => onChange({ encoderPreset: PRESET_SPEEDS[parseInt(e.target.value)] })}
            className="w-full accent-rose-500 cursor-pointer h-2 bg-[#1b1b22] rounded-lg"
          />

          <div className="flex justify-between text-[10px] text-[#707084]">
            <span>Ultrafast (Faster encode)</span>
            <span>Medium</span>
            <span>Veryslow (Smaller file / better quality)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div>
            <label className="block text-[#9a9ab0] mb-1 font-medium">Encoder Tune:</label>
            <select
              value={settings.encoderTune}
              onChange={(e) => onChange({ encoderTune: e.target.value as any })}
              className="w-full bg-[#1b1b22] border border-[#444458] rounded px-2.5 py-1.5 text-white"
            >
              <option value="none">None</option>
              <option value="film">Film (Live action movie)</option>
              <option value="animation">Animation (Anime / 2D cartoons)</option>
              <option value="grain">Grain (Preserve subtle 35mm film grain)</option>
              <option value="fastdecode">Fast Decode (Faster playback on slow CPUs)</option>
              <option value="zerolatency">Zero Latency (Realtime streaming)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9a9ab0] mb-1 font-medium">Encoder Profile:</label>
            <select
              value={settings.encoderProfile}
              onChange={(e) => onChange({ encoderProfile: e.target.value as any })}
              className="w-full bg-[#1b1b22] border border-[#444458] rounded px-2.5 py-1.5 text-white"
            >
              <option value="auto">Auto</option>
              <option value="baseline">Baseline (Old smartphones)</option>
              <option value="main">Main</option>
              <option value="high">High (Modern PCs & TVs)</option>
            </select>
          </div>

          <div>
            <label className="block text-[#9a9ab0] mb-1 font-medium">Encoder Level:</label>
            <select
              value={settings.encoderLevel}
              onChange={(e) => onChange({ encoderLevel: e.target.value as any })}
              className="w-full bg-[#1b1b22] border border-[#444458] rounded px-2.5 py-1.5 text-white"
            >
              <option value="auto">Auto</option>
              <option value="3.1">3.1 (720p)</option>
              <option value="4.0">4.0 (1080p standard)</option>
              <option value="4.1">4.1 (1080p high bitrate)</option>
              <option value="4.2">4.2 (1080p60)</option>
              <option value="5.0">5.0</option>
              <option value="5.1">5.1 (4K)</option>
              <option value="5.2">5.2 (4K60)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[#9a9ab0] mb-1 font-medium">Extra Encoder Options:</label>
          <input
            type="text"
            placeholder="e.g. b-adapt=2:ref=4:subq=8"
            value={settings.extraOpts}
            onChange={(e) => onChange({ extraOpts: e.target.value })}
            className="w-full bg-[#1b1b22] border border-[#444458] rounded px-3 py-1.5 text-white font-mono text-xs"
          />
        </div>
      </div>
    </div>
  );
};
