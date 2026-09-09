import React, { useRef, useState } from 'react';
import { VideoSource } from '../types';
import { SAMPLE_VIDEOS } from '../data/sampleVideos';
import { formatTime } from '../utils/handbrakeCli';
import { UploadCloud, Film, Disc, Sparkles, X, Check } from 'lucide-react';

interface OpenSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSource: (source: VideoSource) => void;
  currentSourceId?: string;
}

export const OpenSourceModal: React.FC<OpenSourceModalProps> = ({
  isOpen,
  onClose,
  onSelectSource,
  currentSourceId
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProbing, setIsProbing] = useState(false);

  if (!isOpen) return null;

  const probeAndLoadFile = (file: File) => {
    setIsProbing(true);
    const objectUrl = URL.createObjectURL(file);
    const tempVideo = document.createElement('video');
    tempVideo.preload = 'metadata';
    tempVideo.src = objectUrl;

    tempVideo.onloadedmetadata = () => {
      const duration = tempVideo.duration || 60;
      const width = tempVideo.videoWidth || 1920;
      const height = tempVideo.videoHeight || 1080;
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

      const newSource: VideoSource = {
        id: `user-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        duration: Math.round(duration),
        width: width,
        height: height,
        fps: 30, // standard probe fallback
        format: file.type || 'video/mp4',
        bitrate: `${Math.round((file.size * 8) / (duration * 1000))} kbps`,
        fileSize: `${sizeMB} MB`,
        file: file,
        audioTracks: [
          { id: 1, name: 'Default Audio Track (Source)', codec: 'AAC', channels: 'Stereo', bitrate: '160 kbps', sampleRate: '48 kHz' }
        ],
        chapters: [
          { id: 1, name: 'Chapter 1', start: 0, duration: Math.round(duration) }
        ],
        subtitles: []
      };

      setIsProbing(false);
      onSelectSource(newSource);
      onClose();
    };

    tempVideo.onerror = () => {
      setIsProbing(false);
      // Fallback if video format cannot be decoded natively in browser preview
      const newSource: VideoSource = {
        id: `user-${Date.now()}`,
        name: file.name,
        url: objectUrl,
        duration: 120,
        width: 1920,
        height: 1080,
        fps: 30,
        format: file.name.split('.').pop()?.toUpperCase() || 'VIDEO',
        bitrate: '5,000 kbps',
        fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        file: file,
        audioTracks: [
          { id: 1, name: 'Track 1', codec: 'AAC', channels: 'Stereo', bitrate: '160 kbps', sampleRate: '44.1 kHz' }
        ],
        chapters: [
          { id: 1, name: 'Chapter 1', start: 0, duration: 120 }
        ],
        subtitles: []
      };
      onSelectSource(newSource);
      onClose();
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      probeAndLoadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      probeAndLoadFile(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-[#24242e] border border-[#404052] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#363646] pb-3">
          <div className="flex items-center space-x-2.5">
            <Disc className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Source Selection</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#8e8ea2] hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Local File Drag & Drop Zone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging 
              ? 'border-rose-500 bg-rose-950/20' 
              : 'border-[#444458] bg-[#1a1a24] hover:bg-[#20202c] hover:border-[#606078]'
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="video/*,.mkv,.mp4,.mov,.webm,.avi,.flv"
            className="hidden"
            onChange={handleFileChange}
          />
          <UploadCloud className="w-12 h-12 text-rose-400 mb-3" />
          <h3 className="font-semibold text-white text-sm mb-1">
            {isProbing ? 'Scanning Source Media...' : 'Open a Video File'}
          </h3>
          <p className="text-[#88889a] text-center max-w-sm text-xs">
            Drag and drop any video file here (MP4, MKV, MOV, WebM, AVI), or click to browse your computer
          </p>
        </div>

        {/* Or choose from Sample Demonstration Media */}
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-[#9a9ab0] font-medium">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Or load a featured demo source video:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {SAMPLE_VIDEOS.map((sample) => {
              const isSelected = sample.id === currentSourceId;
              return (
                <div
                  key={sample.id}
                  onClick={() => {
                    onSelectSource(sample);
                    onClose();
                  }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 text-white'
                      : 'bg-[#1d1d26] border-[#363646] hover:bg-[#282834] text-[#cfcfe0]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <Film className="w-4 h-4 text-amber-400 mb-2 shrink-0" />
                    {isSelected && <Check className="w-4 h-4 text-rose-400" />}
                  </div>
                  <h4 className="font-semibold text-white truncate text-xs" title={sample.name}>
                    {sample.name.replace(/_/g, ' ')}
                  </h4>
                  <div className="text-[10px] text-[#808096] mt-1 space-y-0.5">
                    <div>Res: {sample.width}×{sample.height}</div>
                    <div>Duration: {formatTime(sample.duration)}</div>
                    <div>Format: {sample.format}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#323242] hover:bg-[#3e3e50] text-white rounded font-medium text-xs"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
