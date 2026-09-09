import React, { useRef, useState, useEffect } from 'react';
import { VideoSource, TranscodeSettings } from '../types';
import { formatTime } from '../utils/handbrakeCli';
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  Eye, 
  X,
  FastForward,
  Rewind,
  Gauge
} from 'lucide-react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  source: VideoSource | null;
  settings: TranscodeSettings;
}

const SPEED_OPTIONS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0, 4.0];

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  source,
  settings
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(source?.duration || 100);
  const [isMuted, setIsMuted] = useState(false);
  const [showFiltered, setShowFiltered] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(settings.videoSpeed || 1.0);

  useEffect(() => {
    if (source?.duration) {
      setDuration(source.duration);
    }
  }, [source]);

  useEffect(() => {
    if (settings.videoSpeed) {
      setPlaybackSpeed(settings.videoSpeed);
    }
  }, [settings.videoSpeed]);

  // Apply playback speed to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
      if ('preservesPitch' in videoRef.current) {
        (videoRef.current as any).preservesPitch = settings.speedAudioPitchCompensation ?? true;
      }
    }
  }, [playbackSpeed, settings.speedAudioPitchCompensation]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.playbackRate = playbackSpeed;
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleStepFrame = (deltaSeconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    videoRef.current.currentTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + deltaSeconds));
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleCycleSpeed = (direction: 'up' | 'down') => {
    const currentIdx = SPEED_OPTIONS.findIndex(s => Math.abs(s - playbackSpeed) < 0.05);
    if (direction === 'up') {
      const nextIdx = currentIdx < SPEED_OPTIONS.length - 1 ? currentIdx + 1 : 0;
      handleSpeedChange(SPEED_OPTIONS[nextIdx]);
    } else {
      const prevIdx = currentIdx > 0 ? currentIdx - 1 : SPEED_OPTIONS.length - 1;
      handleSpeedChange(SPEED_OPTIONS[prevIdx]);
    }
  };

  // Construct CSS filter simulation from settings
  const filterStyles: React.CSSProperties = showFiltered ? {
    filter: [
      settings.filters.grayscale ? 'grayscale(100%)' : '',
      settings.filters.sharpen !== 'off' ? 'contrast(115%) brightness(102%)' : '',
      settings.filters.denoise !== 'off' ? 'blur(0.4px)' : ''
    ].filter(Boolean).join(' ')
  } : {};

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-[#22222c] border border-[#404052] rounded-xl max-w-4xl w-full h-[620px] flex flex-col shadow-2xl overflow-hidden">
        {/* Top bar */}
        <div className="px-5 py-3 border-b border-[#363646] bg-[#282834] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Eye className="w-5 h-5 text-teal-400" />
            <h2 className="text-sm font-bold text-white">Video Preview Window</h2>
            <span className="text-[11px] text-[#9090a4]">
              {source ? source.name : 'No source'}
            </span>
          </div>

          {/* Toggle comparison mode */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFiltered(!showFiltered)}
              className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                showFiltered 
                  ? 'bg-rose-950/60 border-rose-600/70 text-rose-300' 
                  : 'bg-[#323242] border-[#444458] text-[#9a9ab0]'
              }`}
            >
              {showFiltered ? 'Filters Preview: ON' : 'Source Raw: ON'}
            </button>

            <button
              onClick={onClose}
              className="p-1 hover:bg-[#38384a] rounded text-[#8e8ea2] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Stage */}
        <div className="flex-1 bg-black relative flex items-center justify-center overflow-hidden p-4">
          {source ? (
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              <video
                ref={videoRef}
                src={source.url}
                className="max-w-full max-h-[420px] rounded shadow-lg object-contain"
                style={filterStyles}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                muted={isMuted}
                loop
                playsInline
              />

              {/* Filter badge overlay */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 text-[10px] text-white space-x-2">
                <span className="font-mono text-emerald-400 font-bold">{source.width}×{source.height}</span>
                <span className="text-white/40">•</span>
                <span>Codec: {settings.videoCodec.toUpperCase()}</span>
                {settings.filters.grayscale && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-amber-400 font-semibold">Grayscale</span>
                  </>
                )}
                {settings.filters.sharpen !== 'off' && (
                  <>
                    <span className="text-white/40">•</span>
                    <span className="text-blue-400">Sharpen: {settings.filters.sharpen}</span>
                  </>
                )}
              </div>

              {/* Speed Badge overlay */}
              <div className="absolute top-2 right-2 flex items-center space-x-1.5 bg-black/70 backdrop-blur-xs px-2.5 py-1 rounded border border-white/10 text-[11px] font-mono font-bold">
                <Gauge className="w-3.5 h-3.5 text-amber-400" />
                <span className={playbackSpeed > 1 ? 'text-rose-400' : playbackSpeed < 1 ? 'text-amber-400' : 'text-emerald-400'}>
                  {playbackSpeed.toFixed(2)}x
                </span>
                {playbackSpeed !== 1.0 && (
                  <span className="text-[9px] text-[#9090a8] font-sans font-normal">
                    ({playbackSpeed > 1 ? 'Tua nhanh' : 'Tua chậm'})
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-[#606072] text-center">
              <Eye className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Load a video source to inspect frames and filters</p>
            </div>
          )}
        </div>

        {/* Controls Bar */}
        <div className="p-3 bg-[#1e1e28] border-t border-[#343444] space-y-2">
          {/* Timeline Seekbar */}
          <div className="flex items-center space-x-3">
            <span className="font-mono text-[11px] text-[#9090a4] w-14 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={(e) => {
                const newTime = parseFloat(e.target.value);
                setCurrentTime(newTime);
                if (videoRef.current) {
                  videoRef.current.currentTime = newTime;
                }
              }}
              className="flex-1 accent-rose-500 h-1.5 bg-[#2d2d3c] rounded cursor-pointer"
            />
            <span className="font-mono text-[11px] text-[#9090a4] w-14">
              {formatTime(duration)}
            </span>
          </div>

          {/* Button row */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStepFrame(-1 / 30)}
                className="p-1.5 bg-[#2b2b38] hover:bg-[#38384a] rounded text-white border border-[#3e3e50]"
                title="Step back 1 frame (1/30s)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlay}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium shadow"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => handleStepFrame(1 / 30)}
                className="p-1.5 bg-[#2b2b38] hover:bg-[#38384a] rounded text-white border border-[#3e3e50]"
                title="Step forward 1 frame (1/30s)"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-[#3e3e50] mx-1" />

              {/* Speed Controls: Rewind / FastForward / Speed Select */}
              <div className="flex items-center space-x-1.5 bg-[#242430] border border-[#38384a] px-2 py-1 rounded">
                <button
                  type="button"
                  onClick={() => handleCycleSpeed('down')}
                  className="p-0.5 hover:bg-[#323242] rounded text-[#9a9ab0] hover:text-white"
                  title="Giảm tốc độ / Tua chậm (<<)"
                >
                  <Rewind className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center space-x-1">
                  <Gauge className="w-3 h-3 text-amber-400" />
                  <select
                    value={playbackSpeed}
                    onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                    className="bg-transparent text-white font-mono font-bold text-xs focus:outline-hidden cursor-pointer"
                  >
                    <option value="0.25" className="bg-[#22222c] text-white">0.25x (Siêu chậm)</option>
                    <option value="0.5" className="bg-[#22222c] text-white">0.5x (Chậm)</option>
                    <option value="0.75" className="bg-[#22222c] text-white">0.75x</option>
                    <option value="1" className="bg-[#22222c] text-white">1.0x (Chuẩn)</option>
                    <option value="1.25" className="bg-[#22222c] text-white">1.25x</option>
                    <option value="1.5" className="bg-[#22222c] text-white">1.5x (Nhanh)</option>
                    <option value="2" className="bg-[#22222c] text-white">2.0x (Tua x2)</option>
                    <option value="4" className="bg-[#22222c] text-white">4.0x (Tua x4)</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleCycleSpeed('up')}
                  className="p-0.5 hover:bg-[#323242] rounded text-[#9a9ab0] hover:text-white"
                  title="Tăng tốc độ / Tua nhanh (>>)"
                >
                  <FastForward className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 hover:bg-[#2b2b38] rounded text-[#8e8ea2] hover:text-white"
                title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>

              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#30303e] hover:bg-[#3c3c4e] text-white rounded font-medium"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
