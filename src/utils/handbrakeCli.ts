import { TranscodeSettings, VideoSource } from '../types';

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function generateCliCommand(source: VideoSource, settings: TranscodeSettings, destination: string): string {
  const parts: string[] = ['HandBrakeCLI'];

  // Input & Output
  parts.push(`-i "${source.name}"`);
  parts.push(`-o "${destination}"`);

  // Container & Optimization
  if (settings.container === 'mp4' && settings.webOptimized) {
    parts.push('-O');
  }
  if (settings.alignAvStart) {
    parts.push('--align-av');
  }
  if (settings.container === 'mkv') {
    parts.push('-f av_mkv');
  } else if (settings.container === 'webm') {
    parts.push('-f av_webm');
  } else {
    parts.push('-f av_mp4');
  }

  // Video Codec
  parts.push(`-e ${settings.videoCodec}`);

  // Rate control
  if (settings.qualityType === 'rf') {
    parts.push(`-q ${settings.rf.toFixed(1)}`);
  } else {
    parts.push(`-b ${settings.avgBitrate}`);
    if (settings.twoPass) {
      parts.push('--two-pass');
      if (settings.turboFirstPass) {
        parts.push('--turbo');
      }
    }
  }

  // Framerate
  if (settings.framerate !== 'auto') {
    parts.push(`-r ${settings.framerate}`);
    parts.push(settings.fpsMode === 'cfr' ? '--cfr' : '--pfr');
  }

  // Encoder speed / preset
  parts.push(`--encoder-preset ${settings.encoderPreset}`);
  if (settings.encoderTune !== 'none') {
    parts.push(`--encoder-tune ${settings.encoderTune}`);
  }
  if (settings.encoderProfile !== 'auto') {
    parts.push(`--encoder-profile ${settings.encoderProfile}`);
  }
  if (settings.encoderLevel !== 'auto') {
    parts.push(`--encoder-level ${settings.encoderLevel}`);
  }

  // Dimensions & Cropping
  if (settings.resolutionLimit !== 'none') {
    const limits: Record<string, [number, number]> = {
      '2160p': [3840, 2160],
      '1080p': [1920, 1080],
      '720p': [1280, 720],
      '480p': [854, 480]
    };
    const maxDim = limits[settings.resolutionLimit];
    if (maxDim) {
      parts.push(`--maxWidth ${maxDim[0]} --maxHeight ${maxDim[1]}`);
    }
  }

  if (settings.cropping === 'custom') {
    const { top, bottom, left, right } = settings.cropValues;
    parts.push(`--crop ${top}:${bottom}:${left}:${right}`);
  } else {
    parts.push('--auto-anamorphic');
  }

  // Filters
  if (settings.filters.deinterlace !== 'off') {
    parts.push(`--comb-detect --decomb=${settings.filters.deinterlace}`);
  }
  if (settings.filters.denoise !== 'off') {
    parts.push(`--denoise=${settings.filters.denoise}`);
  }
  if (settings.filters.sharpen !== 'off') {
    parts.push(`--lapsharp`);
  }
  if (settings.filters.grayscale) {
    parts.push('--grayscale');
  }

  // Video Speed (Tua nhanh, tua chậm / Time scaling)
  if (settings.speed && settings.speed !== 1.0) {
    const ptsFactor = (1 / settings.speed).toFixed(4);
    parts.push(`--vfilter "setpts=${ptsFactor}*PTS"`);
    if (settings.pitchCorrection) {
      parts.push(`--afilter "atempo=${settings.speed}"`);
    }
  }

  // Audio
  parts.push(`-E ${settings.audio.codec}`);
  if (settings.audio.codec !== 'passthru') {
    parts.push(`-B ${settings.audio.bitrate}`);
    parts.push(`--mixdown ${settings.audio.mixdown}`);
    if (settings.audio.sampleRate !== 'auto') {
      parts.push(`-R ${settings.audio.sampleRate}`);
    }
    if (settings.audio.gain !== 0) {
      parts.push(`--gain ${settings.audio.gain}`);
    }
  }

  // Subtitles
  if (settings.burnSubtitle && settings.selectedSubtitleId) {
    parts.push(`-s ${settings.selectedSubtitleId} --subtitle-burned`);
  }

  if (settings.extraOpts.trim()) {
    parts.push(settings.extraOpts.trim());
  }

  return parts.join(' ');
}
