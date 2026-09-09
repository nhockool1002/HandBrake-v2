import React, { useRef, useState, useEffect } from 'react';
import { TranscodeSettings, VideoSource } from '../../types';
import { 
  Gauge, 
  Sliders, 
  Settings2, 
  FastForward, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Clock, 
  Zap, 
  HelpCircle 
} from 'lucide-react';
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

const SPEED_PRESETS = [
  { value: 0.25, label: '0.25x', desc: '1/4x Siêu chậm' },
  { value: 0.5, label: '0.5x', desc: '1/2x Chậm (Slow-mo)' },
  { value: 0.75, label: '0.75x', desc: '0.75x Hơi chậm' },
  { value: 1.0, label: '1.0x', desc: '1.0x Chuẩn (Gốc)' },
  { value: 1.25, label: '1.25x', desc: '1.25x Hơi nhanh' },
  { value: 1.5, label: '1.5x', desc: '1.5x Nhanh' },
  { value: 2.0, label: '2.0x', desc: '2x Gấp đôi' },
  { value: 4.0, label: '4.0x', desc: '4x Cực nhanh' },
];

export const VideoTab: React.FC<VideoTabProps> = ({ settings, onChange, source }) => {
  const currentSpeedIdx = PRESET_SPEEDS.indexOf(settings.encoderPreset as any) !== -1 
    ? PRESET_SPEEDS.indexOf(settings.encoderPreset as any) 
    : 4;

  const currentSpeed = settings.videoSpeed ?? 1.0;
  const pitchCompensation = settings.speedAudioPitchCompensation ?? true;

  // Mini live player state for interactive speed testing inside Video Tab
  const previewVideoRef = useRef<HTMLVideoElement>(null);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [testCurrentTime, setTestCurrentTime] = useState(0);
  const [isTestMuted, setIsTestMuted] = useState(false);

  // Sync playbackRate & pitch whenever currentSpeed or pitchCompensation changes
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.playbackRate = currentSpeed;
      if ('preservesPitch' in previewVideoRef.current) {
        (previewVideoRef.current as any).preservesPitch = pitchCompensation;
      }
      if ('mozPreservesPitch' in previewVideoRef.current) {
        (previewVideoRef.current as any).mozPreservesPitch = pitchCompensation;
      }
      if ('webkitPreservesPitch' in previewVideoRef.current) {
        (previewVideoRef.current as any).webkitPreservesPitch = pitchCompensation;
      }
    }
  }, [currentSpeed, pitchCompensation]);

  const toggleTestPlay = () => {
    if (!previewVideoRef.current) return;
    if (previewVideoRef.current.paused) {
      previewVideoRef.current.playbackRate = currentSpeed;
      previewVideoRef.current.play().then(() => {
        setIsPlayingTest(true);
      }).catch(() => {
        setIsPlayingTest(false);
      });
    } else {
      previewVideoRef.current.pause();
      setIsPlayingTest(false);
    }
  };

  const handleSeek = (newTime: number) => {
    if (previewVideoRef.current) {
      previewVideoRef.current.currentTime = newTime;
      setTestCurrentTime(newTime);
    }
  };

  const handleSpeedStep = (delta: number) => {
    const next = Math.max(0.25, Math.min(4.0, Math.round((currentSpeed + delta) * 20) / 20));
    onChange({ videoSpeed: next });
  };

  // Duration calculations
  const originalDuration = source?.duration || 653;
  const newEstimatedDuration = originalDuration / currentSpeed;

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      {/* Top Section: Video Playback & Encoding Speed (Tua nhanh, Tua chậm) */}
      <div className="bg-[#23232c] border border-amber-500/30 rounded-lg p-4 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3c3c4e] pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <FastForward className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-white text-sm">
                  Tốc độ phát & Tua video (Video Speed / Fast-Forward & Slow-Motion)
                </h3>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                  currentSpeed > 1 
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : currentSpeed < 1
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {currentSpeed.toFixed(2)}x {currentSpeed > 1 ? '• Tua nhanh' : currentSpeed < 1 ? '• Tua chậm' : '• Tốc độ gốc'}
                </span>
              </div>
              <p className="text-[11px] text-[#9a9ab0] mt-0.5">
                Điều chỉnh tốc độ tua nhanh hoặc chuyển động chậm (Slow-motion) cho video và đồng bộ âm thanh
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onChange({ videoSpeed: 1.0 })}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded text-xs transition-colors border ${
                currentSpeed === 1.0
                  ? 'bg-[#2b2b38] border-[#444458] text-[#808094] cursor-default'
                  : 'bg-rose-600/20 border-rose-500/40 text-rose-300 hover:bg-rose-600/30'
              }`}
              title="Đặt lại tốc độ chuẩn 1.0x"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại 1.0x (Chuẩn)</span>
            </button>
          </div>
        </div>

        {/* Speed presets chips */}
        <div>
          <label className="block text-[#9a9ab0] mb-2 font-medium">Mức tốc độ nhanh (Presets):</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {SPEED_PRESETS.map((preset) => {
              const isSelected = Math.abs(currentSpeed - preset.value) < 0.01;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onChange({ videoSpeed: preset.value })}
                  className={`px-2 py-2 rounded border text-center transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold shadow-xs'
                      : 'bg-[#1b1b22] border-[#3e3e50] text-[#c0c0d2] hover:bg-[#282834] hover:border-[#525266]'
                  }`}
                >
                  <span className="text-sm font-mono">{preset.label}</span>
                  <span className="text-[9px] text-[#8e8ea2] leading-tight mt-0.5">{preset.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slider & Fine Stepper */}
        <div className="bg-[#1b1b22] border border-[#383848] rounded-lg p-3 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[#9a9ab0] font-medium flex items-center space-x-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Thanh trượt tinh chỉnh tốc độ (0.25x – 4.0x):</span>
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleSpeedStep(-0.05)}
                disabled={currentSpeed <= 0.25}
                className="w-6 h-6 rounded bg-[#2b2b38] hover:bg-[#38384a] disabled:opacity-40 text-white font-mono font-bold flex items-center justify-center"
                title="Giảm 0.05x"
              >
                -
              </button>

              <span className="font-mono text-base font-bold text-amber-300 min-w-[58px] text-center bg-[#242430] py-0.5 px-2 rounded border border-[#3e3e52]">
                {currentSpeed.toFixed(2)}x
              </span>

              <button
                type="button"
                onClick={() => handleSpeedStep(0.05)}
                disabled={currentSpeed >= 4.0}
                className="w-6 h-6 rounded bg-[#2b2b38] hover:bg-[#38384a] disabled:opacity-40 text-white font-mono font-bold flex items-center justify-center"
                title="Tăng 0.05x"
              >
                +
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <input
              id="range-video-speed"
              type="range"
              min="0.25"
              max="4.0"
              step="0.05"
              value={currentSpeed}
              onChange={(e) => onChange({ videoSpeed: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-[#2d2d3c] rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-[#707086] font-mono px-0.5">
              <span>0.25x (Siêu chậm)</span>
              <span>0.5x</span>
              <span className="text-emerald-400 font-bold">1.0x (Chuẩn)</span>
              <span>1.5x</span>
              <span>2.0x (Tua x2)</span>
              <span>3.0x</span>
              <span>4.0x (Tua x4)</span>
            </div>
          </div>

          {/* Duration estimation badge */}
          <div className="pt-2 border-t border-[#2e2e3e] flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[#a0a0b4]">Thời lượng gốc:</span>
              <span className="font-mono text-white font-medium">{formatTime(originalDuration)}</span>
              <span className="text-[#606076]">➔</span>
              <span className="text-[#a0a0b4]">Thời lượng sau khi tua:</span>
              <span className="font-mono text-amber-300 font-bold">{formatTime(newEstimatedDuration)}</span>
            </div>

            <div className="text-[11px] font-medium text-right">
              {currentSpeed > 1 ? (
                <span className="text-emerald-400">
                  Rút ngắn {Math.round((1 - 1 / currentSpeed) * 100)}% thời gian phát (Nhanh gấp {currentSpeed.toFixed(1)} lần)
                </span>
              ) : currentSpeed < 1 ? (
                <span className="text-amber-400">
                  Kéo dài {Math.round((1 / currentSpeed - 1) * 100)}% thời lượng (Chuyển động chậm mượt)
                </span>
              ) : (
                <span className="text-[#8e8ea2]">Thời lượng giữ nguyên 100% gốc</span>
              )}
            </div>
          </div>
        </div>

        {/* Audio Pitch & Timing Mode Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <label className="flex items-start space-x-2.5 p-2.5 bg-[#1e1e27] border border-[#343444] rounded cursor-pointer hover:border-[#4c4c60] transition-colors">
            <input
              type="checkbox"
              checked={pitchCompensation}
              onChange={(e) => onChange({ speedAudioPitchCompensation: e.target.checked })}
              className="mt-0.5 rounded bg-[#2a2a38] border-[#444458] text-amber-500 focus:ring-0"
            />
            <div>
              <span className="font-medium text-white block">
                Bảo toàn cao độ âm thanh (Pitch Compensation)
              </span>
              <p className="text-[10px] text-[#8e8ea2] mt-0.5">
                Giữ giọng nói tự nhiên khi tua nhanh/chậm. Ngăn ngừa hiện tượng giọng sóc chuột (chipmunk) the thé khi tua nhanh hoặc trầm đục khi tua chậm.
              </p>
            </div>
          </label>

          <div className="p-2.5 bg-[#1e1e27] border border-[#343444] rounded flex flex-col justify-between">
            <div className="flex items-start space-x-2">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
              <div>
                <span className="font-medium text-white block">Cơ chế xử lý video PTS</span>
                <p className="text-[10px] text-[#8e8ea2] mt-0.5 font-mono">
                  Filter: setpts={(1 / currentSpeed).toFixed(4)}*PTS{pitchCompensation && currentSpeed !== 1 ? `, atempo=${currentSpeed}` : ''}
                </p>
              </div>
            </div>
            <span className="text-[9px] text-emerald-400/80 mt-1">
              ✓ Tự động tái điều chỉnh khung hình tương thích chuẩn xuất của HandBrake
            </span>
          </div>
        </div>

        {/* Interactive Live Speed Test Player inside Video Tab */}
        {source && (
          <div className="bg-[#181820] border border-[#343444] rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="font-semibold text-white">Thử nghiệm trực tiếp tốc độ phát:</span>
                <span className="text-[10px] text-[#9090a6]">
                  (Bấm Play để nghe và xem video chạy ở tốc độ {currentSpeed.toFixed(2)}x)
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setIsTestMuted(!isTestMuted)}
                  className="p-1 rounded text-[#9a9ab0] hover:text-white hover:bg-[#282834]"
                  title={isTestMuted ? 'Bật âm thanh' : 'Tắt âm'}
                >
                  {isTestMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Mini video frame */}
              <div className="relative w-40 h-24 bg-black rounded overflow-hidden shrink-0 border border-[#383848] flex items-center justify-center">
                <video
                  ref={previewVideoRef}
                  src={source.url}
                  className="w-full h-full object-contain"
                  onTimeUpdate={(e) => setTestCurrentTime(e.currentTarget.currentTime)}
                  onEnded={() => setIsPlayingTest(false)}
                  muted={isTestMuted}
                  loop
                  playsInline
                />
                <div className="absolute top-1 right-1 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-mono text-amber-300 font-bold">
                  {currentSpeed.toFixed(2)}x
                </div>
              </div>

              {/* Player controls */}
              <div className="flex-1 w-full space-y-2">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleTestPlay}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded font-medium shadow-xs"
                  >
                    {isPlayingTest ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                    <span>{isPlayingTest ? 'Tạm dừng' : 'Phát thử nghiệm'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(Math.max(0, testCurrentTime - 5))}
                    className="px-2 py-1.5 bg-[#282836] hover:bg-[#343446] rounded text-white text-[11px]"
                  >
                    -5s
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSeek(Math.min(originalDuration, testCurrentTime + 5))}
                    className="px-2 py-1.5 bg-[#282836] hover:bg-[#343446] rounded text-white text-[11px]"
                  >
                    +5s
                  </button>

                  <div className="font-mono text-[11px] text-[#9a9ab0] ml-auto">
                    {formatTime(testCurrentTime)} / {formatTime(originalDuration)}
                  </div>
                </div>

                {/* Progress bar */}
                <input
                  type="range"
                  min="0"
                  max={originalDuration}
                  step="0.1"
                  value={testCurrentTime}
                  onChange={(e) => handleSeek(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-[#2c2c3c] rounded cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}
      </div>

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
