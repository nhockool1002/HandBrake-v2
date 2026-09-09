import React, { useState } from 'react';
import { TranscodeSettings, VideoSource } from '../types';
import { SummaryTab } from './tabs/SummaryTab';
import { DimensionsTab } from './tabs/DimensionsTab';
import { FiltersTab } from './tabs/FiltersTab';
import { VideoTab } from './tabs/VideoTab';
import { AudioTab } from './tabs/AudioTab';
import { SubtitlesTab } from './tabs/SubtitlesTab';
import { ChaptersTab } from './tabs/ChaptersTab';
import { 
  FileText, 
  Maximize2, 
  Sparkles, 
  Film, 
  Volume2, 
  Subtitles, 
  BookOpen 
} from 'lucide-react';

interface SettingsNotebookProps {
  settings: TranscodeSettings;
  onChange: (updated: Partial<TranscodeSettings>) => void;
  source: VideoSource | null;
}

export const SettingsNotebook: React.FC<SettingsNotebookProps> = ({ settings, onChange, source }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'dimensions' | 'filters' | 'video' | 'audio' | 'subtitles' | 'chapters'>('summary');

  const tabs = [
    { id: 'summary', label: 'Summary', icon: FileText },
    { id: 'dimensions', label: 'Dimensions', icon: Maximize2 },
    { id: 'filters', label: 'Filters', icon: Sparkles },
    { id: 'video', label: 'Video', icon: Film },
    { id: 'audio', label: 'Audio', icon: Volume2 },
    { id: 'subtitles', label: 'Subtitles', icon: Subtitles },
    { id: 'chapters', label: 'Chapters', icon: BookOpen },
  ] as const;

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#1c1c24]">
      {/* HandBrake Notebook Tab Strip */}
      <div className="flex items-center px-3 pt-2 bg-[#22222b] border-b border-[#363646] space-x-1 overflow-x-auto select-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-t-md transition-all whitespace-nowrap border-t border-x ${
                isActive
                  ? 'bg-[#1c1c24] text-rose-400 border-[#3c3c4e] border-b-[#1c1c24] -mb-px z-10 shadow-xs'
                  : 'bg-[#292934] text-[#a0a0b2] hover:text-white hover:bg-[#30303e] border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-rose-400' : 'text-[#808096]'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Body */}
      <div className="flex-1 overflow-y-auto min-h-0 bg-[#1c1c24]">
        {activeTab === 'summary' && <SummaryTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'dimensions' && <DimensionsTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'filters' && <FiltersTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'video' && <VideoTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'audio' && <AudioTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'subtitles' && <SubtitlesTab settings={settings} onChange={onChange} source={source} />}
        {activeTab === 'chapters' && <ChaptersTab source={source} />}
      </div>
    </div>
  );
};
