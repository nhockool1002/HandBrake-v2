import React, { useState } from 'react';
import { TranscodePreset, PresetCategory } from '../types';
import { SlidersHorizontal, Search, Plus, Trash2, Check, Download, Upload, X } from 'lucide-react';

interface PresetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  presets: TranscodePreset[];
  activePresetId: string;
  onSelectPreset: (preset: TranscodePreset) => void;
  onSaveCustomPreset: (name: string, category: PresetCategory, description: string) => void;
  onDeleteCustomPreset: (id: string) => void;
  onImportPresets: (imported: TranscodePreset[]) => void;
}

const CATEGORIES: PresetCategory[] = ['General', 'Web', 'Devices', 'Matroska', 'Production', 'Custom'];

export const PresetsDrawer: React.FC<PresetsDrawerProps> = ({
  isOpen,
  onClose,
  presets,
  activePresetId,
  onSelectPreset,
  onSaveCustomPreset,
  onDeleteCustomPreset,
  onImportPresets
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetCategory, setNewPresetCategory] = useState<PresetCategory>('Custom');
  const [newPresetDesc, setNewPresetDesc] = useState('');

  if (!isOpen) return null;

  const filteredPresets = presets.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleExport = () => {
    const jsonStr = JSON.stringify(presets, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'handbrake_presets.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (Array.isArray(data)) {
          onImportPresets(data);
        }
      } catch (err) {
        alert('Invalid JSON presets file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <aside className="w-80 bg-[#1f1f27] border-l border-[#363646] flex flex-col h-full z-20 shadow-xl select-none text-xs">
      {/* Header */}
      <div className="p-3 border-b border-[#363646] flex items-center justify-between bg-[#242430]">
        <div className="flex items-center space-x-2">
          <SlidersHorizontal className="w-4 h-4 text-rose-400" />
          <h2 className="font-semibold text-white">Preset Manager</h2>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1 hover:bg-[#38384a] rounded text-emerald-400"
            title="Save current settings as new preset"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="p-1 hover:bg-[#38384a] rounded text-blue-400"
            title="Export presets to JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          <label className="p-1 hover:bg-[#38384a] rounded text-purple-400 cursor-pointer" title="Import presets JSON">
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
          </label>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#38384a] rounded text-[#8e8ea2] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="p-2 border-b border-[#30303e] bg-[#1a1a22]">
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#77778a]" />
          <input
            type="text"
            placeholder="Filter presets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#252532] border border-[#3e3e50] rounded pl-8 pr-2.5 py-1 text-white text-xs placeholder-[#666678] focus:outline-hidden focus:border-rose-500"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex items-center space-x-1 p-2 overflow-x-auto border-b border-[#30303e] bg-[#1d1d26]">
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
            selectedCategory === 'All'
              ? 'bg-rose-600 text-white'
              : 'bg-[#2a2a38] text-[#9090a4] hover:text-white'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-rose-600 text-white'
                : 'bg-[#2a2a38] text-[#9090a4] hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Presets List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 divide-y divide-[#2a2a38]">
        {filteredPresets.map((p) => {
          const isActive = p.id === activePresetId;
          const isCustom = p.category === 'Custom';
          return (
            <div
              key={p.id}
              onClick={() => onSelectPreset(p)}
              className={`p-2.5 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? 'bg-rose-950/40 border border-rose-500/80 text-white shadow-xs'
                  : 'hover:bg-[#282836] border border-transparent text-[#d0d0dc]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="font-semibold text-xs flex items-center space-x-1.5">
                  <span>{p.name}</span>
                  {isActive && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] bg-[#2d2d3c] px-1.5 py-0.5 rounded text-[#8e8ea4]">
                    {p.category}
                  </span>
                  {isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCustomPreset(p.id);
                      }}
                      className="p-0.5 text-[#88889a] hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-[11px] text-[#8e8ea2] mt-1 line-clamp-2 leading-relaxed">
                {p.description}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1 text-[10px] text-[#707086]">
                <span className="bg-[#171720] px-1.5 py-0.5 rounded font-mono uppercase">{p.settings.videoCodec}</span>
                <span className="bg-[#171720] px-1.5 py-0.5 rounded font-mono">RF {p.settings.rf}</span>
                <span className="bg-[#171720] px-1.5 py-0.5 rounded uppercase font-mono">{p.settings.container}</span>
                <span className="bg-[#171720] px-1.5 py-0.5 rounded">{p.settings.encoderPreset}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Preset Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#24242e] border border-[#444458] rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-white">Save Current Configuration As Preset</h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#9a9ab0] mb-1">Preset Name:</label>
                <input
                  type="text"
                  placeholder="e.g. My 4K Streamer"
                  value={newPresetName}
                  onChange={(e) => setNewPresetName(e.target.value)}
                  className="w-full bg-[#1a1a22] border border-[#444458] rounded px-3 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block text-[#9a9ab0] mb-1">Category:</label>
                <select
                  value={newPresetCategory}
                  onChange={(e) => setNewPresetCategory(e.target.value as any)}
                  className="w-full bg-[#1a1a22] border border-[#444458] rounded px-3 py-1.5 text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#9a9ab0] mb-1">Description:</label>
                <textarea
                  placeholder="Short description of this configuration..."
                  value={newPresetDesc}
                  onChange={(e) => setNewPresetDesc(e.target.value)}
                  rows={2}
                  className="w-full bg-[#1a1a22] border border-[#444458] rounded px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1.5 bg-[#323240] hover:bg-[#3d3d4e] rounded text-white text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newPresetName.trim()) return;
                  onSaveCustomPreset(newPresetName.trim(), newPresetCategory, newPresetDesc.trim());
                  setShowAddModal(false);
                  setNewPresetName('');
                  setNewPresetDesc('');
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 rounded text-white font-medium text-xs shadow"
              >
                Save Preset
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
