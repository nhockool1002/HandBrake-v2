import { TranscodePreset, TranscodeSettings } from '../types';

export const defaultSettings: TranscodeSettings = {
  container: 'mp4',
  webOptimized: true,
  alignAvStart: true,
  ipod5gSupport: false,

  resolutionLimit: '1080p',
  customWidth: 1920,
  customHeight: 1080,
  anamorphic: 'auto',
  cropping: 'auto',
  cropValues: { top: 0, bottom: 0, left: 0, right: 0 },

  filters: {
    detelecine: 'off',
    deinterlace: 'decomb',
    denoise: 'off',
    denoisePreset: 'film',
    sharpen: 'off',
    chromaSmooth: 'off',
    deband: 'off',
    grayscale: false
  },

  videoCodec: 'x264',
  fpsMode: 'cfr',
  framerate: 30,
  qualityType: 'rf',
  rf: 22,
  avgBitrate: 6000,
  twoPass: true,
  turboFirstPass: true,
  encoderPreset: 'fast',
  encoderTune: 'none',
  encoderProfile: 'main',
  encoderLevel: '4.0',
  extraOpts: '',

  speed: 1.0,
  pitchCorrection: true,
  speedMode: 'pts',

  audio: {
    codec: 'aac',
    bitrate: 160,
    mixdown: 'stereo',
    sampleRate: 'auto',
    gain: 0,
    drc: 0
  },

  burnSubtitle: false,
  selectedSubtitleId: null
};

export const BUILTIN_PRESETS: TranscodePreset[] = [
  {
    id: 'fast-1080p30',
    name: 'Fast 1080p30 (Default)',
    category: 'General',
    description: 'H.264 video (up to 1080p30) and AAC stereo audio in an MP4 container. Great balance between speed, size, and quality.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 22,
      encoderPreset: 'fast',
      resolutionLimit: '1080p'
    }
  },
  {
    id: 'very-fast-1080p30',
    name: 'Very Fast 1080p30',
    category: 'General',
    description: 'H.264 video (up to 1080p30) and AAC stereo audio. Optimized for higher encoding speed at slight compression cost.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 24,
      encoderPreset: 'veryfast',
      resolutionLimit: '1080p'
    }
  },
  {
    id: 'hq-1080p30',
    name: 'HQ 1080p30 Surround',
    category: 'General',
    description: 'High quality H.264 video with AAC stereo + AC3 5.1 surround sound audio.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 20,
      encoderPreset: 'slow',
      resolutionLimit: '1080p',
      audio: {
        codec: 'aac',
        bitrate: 256,
        mixdown: '5.1',
        sampleRate: '48',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'super-hq-1080p30',
    name: 'Super HQ 1080p30 Surround',
    category: 'General',
    description: 'Near-lossless H.264 video with multi-channel surround sound audio tracks.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 18,
      encoderPreset: 'veryslow',
      resolutionLimit: '1080p',
      audio: {
        codec: 'aac',
        bitrate: 320,
        mixdown: '5.1',
        sampleRate: '48',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'fast-720p30',
    name: 'Fast 720p30',
    category: 'General',
    description: 'H.264 video (up to 720p30) and AAC stereo audio in an MP4 container. Smaller file size.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 22,
      encoderPreset: 'fast',
      resolutionLimit: '720p',
      customWidth: 1280,
      customHeight: 720
    }
  },
  {
    id: 'web-discord',
    name: 'Discord Nitro (Under 50MB)',
    category: 'Web',
    description: 'Targeted average bitrate to comfortably fit within 50MB Discord limits with high visual retention.',
    settings: {
      ...defaultSettings,
      qualityType: 'bitrate',
      avgBitrate: 2200,
      twoPass: true,
      resolutionLimit: '720p',
      audio: {
        codec: 'aac',
        bitrate: 128,
        mixdown: 'stereo',
        sampleRate: '44.1',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'web-gmail',
    name: 'Gmail Attachment (25MB Limit)',
    category: 'Web',
    description: 'Compressed for email attachment limits (25MB max size) with 720p resolution and optimized moov atom.',
    settings: {
      ...defaultSettings,
      qualityType: 'bitrate',
      avgBitrate: 1200,
      twoPass: true,
      resolutionLimit: '720p',
      audio: {
        codec: 'aac',
        bitrate: 96,
        mixdown: 'stereo',
        sampleRate: '44.1',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'web-youtube-1080p',
    name: 'YouTube 1080p60',
    category: 'Web',
    description: 'High framerate 60fps MP4 with Web Optimization for instant YouTube processing.',
    settings: {
      ...defaultSettings,
      framerate: 60,
      rf: 19,
      encoderPreset: 'medium',
      resolutionLimit: '1080p',
      audio: {
        codec: 'aac',
        bitrate: 256,
        mixdown: 'stereo',
        sampleRate: '48',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'device-apple',
    name: 'Apple 1080p30 Surround',
    category: 'Devices',
    description: 'Optimized for iPhone, iPad, and Apple TV playback with broad hardware acceleration compatibility.',
    settings: {
      ...defaultSettings,
      container: 'mp4',
      videoCodec: 'x264',
      encoderProfile: 'high',
      encoderLevel: '4.1',
      rf: 21,
      audio: {
        codec: 'aac',
        bitrate: 192,
        mixdown: '5.1',
        sampleRate: '48',
        gain: 0,
        drc: 0
      }
    }
  },
  {
    id: 'device-android',
    name: 'Android 1080p30',
    category: 'Devices',
    description: 'Optimized for modern Android smartphones and tablets with efficient H.264 profile.',
    settings: {
      ...defaultSettings,
      container: 'mp4',
      rf: 22,
      encoderPreset: 'fast',
      resolutionLimit: '1080p'
    }
  },
  {
    id: 'mkv-h265',
    name: 'H.265 MKV 1080p30',
    category: 'Matroska',
    description: 'Matroska container with high-efficiency x265 HEVC encoding for maximum storage savings.',
    settings: {
      ...defaultSettings,
      container: 'mkv',
      videoCodec: 'x265',
      rf: 24,
      encoderPreset: 'medium',
      resolutionLimit: '1080p'
    }
  },
  {
    id: 'mkv-av1',
    name: 'SVT-AV1 MKV 1080p30',
    category: 'Matroska',
    description: 'Modern royalty-free AV1 codec with incredible compression efficiency in an MKV container.',
    settings: {
      ...defaultSettings,
      container: 'mkv',
      videoCodec: 'svt-av1',
      rf: 26,
      encoderPreset: 'medium',
      resolutionLimit: '1080p'
    }
  },
  {
    id: 'production-standard',
    name: 'Production Standard',
    category: 'Production',
    description: 'Post-production editing friendly transcode with constant framerate, keyframe every 1s, and high bitrate.',
    settings: {
      ...defaultSettings,
      videoCodec: 'x264',
      rf: 16,
      encoderPreset: 'slow',
      encoderTune: 'film',
      resolutionLimit: 'none',
      audio: {
        codec: 'flac',
        bitrate: 320,
        mixdown: 'stereo',
        sampleRate: '48',
        gain: 0,
        drc: 0
      }
    }
  }
];
