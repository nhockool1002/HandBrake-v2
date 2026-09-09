export interface AudioTrackInfo {
  id: number;
  name: string;
  codec: string;
  channels: string;
  bitrate: string;
  sampleRate: string;
}

export interface ChapterInfo {
  id: number;
  name: string;
  start: number;
  duration: number;
}

export interface SubtitleInfo {
  id: number;
  language: string;
  format: string;
  isDefault: boolean;
  isForced: boolean;
}

export interface VideoSource {
  id: string;
  name: string;
  url: string;
  duration: number; // in seconds
  width: number;
  height: number;
  fps: number;
  format: string;
  bitrate: string;
  fileSize: string;
  file?: File;
  audioTracks: AudioTrackInfo[];
  chapters: ChapterInfo[];
  subtitles: SubtitleInfo[];
}

export type PresetCategory = 'General' | 'Web' | 'Devices' | 'Matroska' | 'Production' | 'Custom';

export interface TranscodeSettings {
  container: 'mp4' | 'mkv' | 'webm';
  webOptimized: boolean;
  alignAvStart: boolean;
  ipod5gSupport: boolean;
  
  // Dimensions
  resolutionLimit: 'none' | '2160p' | '1080p' | '720p' | '480p';
  customWidth: number;
  customHeight: number;
  anamorphic: 'none' | 'auto' | 'loose';
  cropping: 'auto' | 'custom';
  cropValues: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };

  // Filters
  filters: {
    detelecine: 'off' | 'default';
    deinterlace: 'off' | 'yadif' | 'decomb' | 'bwdif';
    denoise: 'off' | 'nlmeans' | 'hqdn3d';
    denoisePreset: 'film' | 'grain' | 'animation';
    sharpen: 'off' | 'unsharp' | 'lapsharp';
    chromaSmooth: 'off' | 'light' | 'medium' | 'strong';
    deband: 'off' | 'light' | 'medium';
    grayscale: boolean;
  };

  // Video
  videoCodec: 'x264' | 'x265' | 'svt-av1' | 'vp9' | 'mpeg4';
  fpsMode: 'vfr' | 'cfr';
  framerate: number | 'auto';
  qualityType: 'rf' | 'bitrate';
  rf: number; // 0 to 51
  avgBitrate: number; // kbps
  twoPass: boolean;
  turboFirstPass: boolean;
  encoderPreset: 'ultrafast' | 'superfast' | 'veryfast' | 'faster' | 'fast' | 'medium' | 'slow' | 'slower' | 'veryslow';
  encoderTune: 'none' | 'film' | 'animation' | 'grain' | 'fastdecode' | 'zerolatency';
  encoderProfile: 'auto' | 'baseline' | 'main' | 'high';
  encoderLevel: 'auto' | '3.1' | '4.0' | '4.1' | '4.2' | '5.0' | '5.1' | '5.2';
  extraOpts: string;

  // Video Playback & Encoding Speed (Tua nhanh / Chậm)
  videoSpeed: number; // e.g. 0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4
  speedAudioPitchCompensation: boolean;

  // Audio
  audio: {
    codec: 'aac' | 'ac3' | 'mp3' | 'opus' | 'flac' | 'passthru';
    bitrate: number;
    mixdown: 'stereo' | 'mono' | '5.1' | 'dpl2';
    sampleRate: 'auto' | '44.1' | '48';
    gain: number;
    drc: number;
  };

  // Subtitles
  burnSubtitle: boolean;
  selectedSubtitleId: number | null;
}

export interface TranscodePreset {
  id: string;
  name: string;
  category: PresetCategory;
  description: string;
  settings: TranscodeSettings;
}

export interface QueueJob {
  id: string;
  sourceName: string;
  sourceUrl: string;
  presetName: string;
  destination: string;
  settings: TranscodeSettings;
  status: 'queued' | 'encoding' | 'paused' | 'completed' | 'cancelled' | 'error';
  progress: number; // 0 to 100
  fps: number;
  eta: string;
  elapsed: string;
  outputSize: string;
  outputBlobUrl?: string;
  cliCommand: string;
  log: string[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
}
