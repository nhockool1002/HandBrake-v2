import { VideoSource } from '../types';

export const SAMPLE_VIDEOS: VideoSource[] = [
  {
    id: 'sample-bbb',
    name: 'Big_Buck_Bunny_1080p_60fps.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 596,
    width: 1920,
    height: 1080,
    fps: 60,
    format: 'QuickTime / MOV / MP4',
    bitrate: '8,450 kbps',
    fileSize: '158.2 MB',
    audioTracks: [
      { id: 1, name: 'Surround 5.1 English', codec: 'AC3', channels: '5.1 Channels', bitrate: '384 kbps', sampleRate: '48 kHz' },
      { id: 2, name: 'Stereo Director Commentary', codec: 'AAC', channels: '2 Channels (Stereo)', bitrate: '160 kbps', sampleRate: '44.1 kHz' }
    ],
    chapters: [
      { id: 1, name: 'Chapter 1: Morning Awakening', start: 0, duration: 120 },
      { id: 2, name: 'Chapter 2: The Forest Creatures', start: 120, duration: 180 },
      { id: 3, name: 'Chapter 3: Revenge of the Bunny', start: 300, duration: 296 }
    ],
    subtitles: [
      { id: 1, language: 'English (SDH)', format: 'SubRip (SRT)', isDefault: true, isForced: false },
      { id: 2, language: 'French (Français)', format: 'SubRip (SRT)', isDefault: false, isForced: false },
      { id: 3, language: 'Spanish (Español)', format: 'SubRip (SRT)', isDefault: false, isForced: false }
    ]
  },
  {
    id: 'sample-tos',
    name: 'Tears_of_Steel_4K_Teaser.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 734,
    width: 1920,
    height: 800,
    fps: 24,
    format: 'Matroska / MP4',
    bitrate: '11,200 kbps',
    fileSize: '242.6 MB',
    audioTracks: [
      { id: 1, name: 'Main Feature 5.1 Master', codec: 'DTS-HD MA / AC3', channels: '5.1 Channels', bitrate: '640 kbps', sampleRate: '48 kHz' }
    ],
    chapters: [
      { id: 1, name: '01: The Amsterdam Bridge', start: 0, duration: 240 },
      { id: 2, name: '02: Drone Infiltration', start: 240, duration: 260 },
      { id: 3, name: '03: Neural Memory Link', start: 500, duration: 234 }
    ],
    subtitles: [
      { id: 1, language: 'English Dialogue', format: 'SubRip (SRT)', isDefault: true, isForced: false },
      { id: 2, language: 'German (Deutsch)', format: 'SubRip (SRT)', isDefault: false, isForced: false }
    ]
  },
  {
    id: 'sample-elephants-dream',
    name: 'Elephants_Dream_HD_Master.mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    duration: 653,
    width: 1920,
    height: 1080,
    fps: 24,
    format: 'MP4 / H.264',
    bitrate: '6,200 kbps',
    fileSize: '135.8 MB',
    audioTracks: [
      { id: 1, name: 'English 5.1 Surround', codec: 'AAC', channels: '5.1 Channels', bitrate: '320 kbps', sampleRate: '48 kHz' }
    ],
    chapters: [
      { id: 1, name: 'Chapter 1: The Machine Depths', start: 0, duration: 300 },
      { id: 2, name: 'Chapter 2: Proog and Emo', start: 300, duration: 353 }
    ],
    subtitles: [
      { id: 1, language: 'English', format: 'SubRip (SRT)', isDefault: true, isForced: false }
    ]
  }
];
