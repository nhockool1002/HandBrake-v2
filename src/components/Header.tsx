import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  FolderOpen, 
  PlusCircle, 
  ListOrdered, 
  SlidersHorizontal, 
  Eye, 
  Terminal
} from 'lucide-react';

interface HeaderProps {
  onOpenSourceClick: () => void;
  onAddToQueue: () => void;
  onStartEncode: () => void;
  onPauseEncode: () => void;
  onStopEncode: () => void;
  onToggleQueue: () => void;
  onTogglePresets: () => void;
  onOpenPreview: () => void;
  onOpenActivityLog: () => void;
  isEncoding: boolean;
  isPaused: boolean;
  queueCount: number;
  presetsOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSourceClick,
  onAddToQueue,
  onStartEncode,
  onPauseEncode,
  onStopEncode,
  onToggleQueue,
  onTogglePresets,
  onOpenPreview,
  onOpenActivityLog,
  isEncoding,
  isPaused,
  queueCount,
  presetsOpen
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [showAbout, setShowAbout] = useState(false);

  return (
    <header className="flex flex-col bg-[#26262e] border-b border-[#3c3c4a] select-none text-xs">
      {/* Top Application Menu Bar */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1f1f26] border-b border-[#32323e] text-[#b8b8c5]">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 font-semibold text-white mr-2">
            <span className="text-lg">🍍</span>
            <span className="text-sm tracking-tight text-white font-medium">HandBrake</span>
            <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-700/50 px-1 rounded">v2.0 Web</span>
          </div>

          <div className="relative inline-block">
            <button 
              id="menu-file-btn"
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-0.5 rounded hover:bg-[#383848] ${activeMenu === 'file' ? 'bg-[#383848] text-white' : ''}`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div 
                className="absolute left-0 top-full mt-1 w-48 bg-[#2a2a34] border border-[#444456] rounded shadow-2xl py-1 z-50 text-[#d0d0dc]"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  id="menu-open-source"
                  onClick={() => { onOpenSourceClick(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Open Source...</span>
                  <span className="text-[10px] opacity-60">Ctrl+O</span>
                </button>
                <div className="my-1 border-t border-[#3c3c4c]"></div>
                <button 
                  id="menu-add-queue"
                  onClick={() => { onAddToQueue(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Add To Queue</span>
                  <span className="text-[10px] opacity-60">Ctrl+B</span>
                </button>
                <button 
                  id="menu-start-encode"
                  onClick={() => { onStartEncode(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Start Encode</span>
                  <span className="text-[10px] opacity-60">Ctrl+R</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative inline-block">
            <button 
              id="menu-tools-btn"
              onClick={() => setActiveMenu(activeMenu === 'tools' ? null : 'tools')}
              className={`px-2 py-0.5 rounded hover:bg-[#383848] ${activeMenu === 'tools' ? 'bg-[#383848] text-white' : ''}`}
            >
              Tools
            </button>
            {activeMenu === 'tools' && (
              <div 
                className="absolute left-0 top-full mt-1 w-48 bg-[#2a2a34] border border-[#444456] rounded shadow-2xl py-1 z-50 text-[#d0d0dc]"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  id="menu-queue"
                  onClick={() => { onToggleQueue(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Show Queue</span>
                  <span className="text-[10px] opacity-60">Ctrl+U</span>
                </button>
                <button 
                  id="menu-activity"
                  onClick={() => { onOpenActivityLog(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Activity Log</span>
                  <span className="text-[10px] opacity-60">Ctrl+L</span>
                </button>
                <button 
                  id="menu-preview"
                  onClick={() => { onOpenPreview(); setActiveMenu(null); }}
                  className="w-full text-left px-3 py-1.5 hover:bg-rose-600 hover:text-white flex items-center justify-between"
                >
                  <span>Preview Window</span>
                  <span className="text-[10px] opacity-60">Ctrl+P</span>
                </button>
              </div>
            )}
          </div>

          <div className="relative inline-block">
            <button 
              id="menu-preset-btn"
              onClick={() => { onTogglePresets(); setActiveMenu(null); }}
              className="px-2 py-0.5 rounded hover:bg-[#383848]"
            >
              Presets
            </button>
          </div>

          <div className="relative inline-block">
            <button 
              id="menu-help-btn"
              onClick={() => setShowAbout(true)}
              className="px-2 py-0.5 rounded hover:bg-[#383848]"
            >
              About
            </button>
          </div>
        </div>

        <div className="text-[11px] text-[#8e8e9e] flex items-center space-x-2">
          <span>libhb engine ready</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
        </div>
      </div>

      {/* Main Action Tool Shelf (HandBrake Icon Toolbar) */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#282832]">
        <div className="flex items-center space-x-2">
          {/* Open Source Button */}
          <button
            id="toolbar-open-source"
            onClick={onOpenSourceClick}
            className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-[#333342] hover:bg-[#3d3d4e] active:bg-[#252530] border border-[#48485c] text-white transition-all shadow-sm group"
            title="Open a single video file or DVD/BD source"
          >
            <FolderOpen className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-medium tracking-tight">Open Source</span>
          </button>

          <div className="h-9 w-px bg-[#3e3e4e] mx-1"></div>

          {/* Add to Queue */}
          <button
            id="toolbar-add-queue"
            onClick={onAddToQueue}
            className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-[#333342] hover:bg-[#3d3d4e] active:bg-[#252530] border border-[#48485c] text-white transition-all shadow-sm group"
            title="Add current job settings to transcode queue"
          >
            <PlusCircle className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-medium tracking-tight">Add to Queue</span>
          </button>

          {/* Start / Pause / Stop Encode */}
          {!isEncoding ? (
            <button
              id="toolbar-start-encode"
              onClick={onStartEncode}
              className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-emerald-900/60 hover:bg-emerald-800/80 active:bg-emerald-950 border border-emerald-600/70 text-emerald-100 transition-all shadow-sm group"
              title="Start encoding queued items"
            >
              <Play className="w-5 h-5 fill-emerald-400 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
              <span className="text-[11px] font-medium tracking-tight">Start Encode</span>
            </button>
          ) : (
            <div className="flex items-center space-x-1">
              <button
                id="toolbar-pause-encode"
                onClick={onPauseEncode}
                className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-amber-900/60 hover:bg-amber-800/80 active:bg-amber-950 border border-amber-600/70 text-amber-100 transition-all shadow-sm group"
                title={isPaused ? "Resume Encode" : "Pause Encode"}
              >
                {isPaused ? (
                  <>
                    <Play className="w-5 h-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[11px] font-medium tracking-tight">Resume</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-5 h-5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform mb-1" />
                    <span className="text-[11px] font-medium tracking-tight">Pause</span>
                  </>
                )}
              </button>
              <button
                id="toolbar-stop-encode"
                onClick={onStopEncode}
                className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-rose-900/60 hover:bg-rose-800/80 active:bg-rose-950 border border-rose-600/70 text-rose-100 transition-all shadow-sm group"
                title="Stop current encoding job"
              >
                <Square className="w-5 h-5 fill-rose-400 text-rose-400 group-hover:scale-110 transition-transform mb-1" />
                <span className="text-[11px] font-medium tracking-tight">Stop</span>
              </button>
            </div>
          )}

          {/* Show Queue Button with badge */}
          <button
            id="toolbar-show-queue"
            onClick={onToggleQueue}
            className="relative flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-[#333342] hover:bg-[#3d3d4e] active:bg-[#252530] border border-[#48485c] text-white transition-all shadow-sm group"
            title="Open Queue Drawer"
          >
            <ListOrdered className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-medium tracking-tight">Queue</span>
            {queueCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow">
                {queueCount}
              </span>
            )}
          </button>

          <div className="h-9 w-px bg-[#3e3e4e] mx-1"></div>

          {/* Preview Window */}
          <button
            id="toolbar-preview"
            onClick={onOpenPreview}
            className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-[#333342] hover:bg-[#3d3d4e] active:bg-[#252530] border border-[#48485c] text-white transition-all shadow-sm group"
            title="Preview output with applied filters"
          >
            <Eye className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-medium tracking-tight">Preview</span>
          </button>

          {/* Activity Log */}
          <button
            id="toolbar-activity-log"
            onClick={onOpenActivityLog}
            className="flex flex-col items-center justify-center w-18 h-15 rounded-lg bg-[#333342] hover:bg-[#3d3d4e] active:bg-[#252530] border border-[#48485c] text-white transition-all shadow-sm group"
            title="Open detailed activity log console"
          >
            <Terminal className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1" />
            <span className="text-[11px] font-medium tracking-tight">Activity Log</span>
          </button>
        </div>

        {/* Presets Toggle on Right */}
        <div className="flex items-center space-x-2">
          <button
            id="toolbar-toggle-presets"
            onClick={onTogglePresets}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
              presetsOpen 
                ? 'bg-rose-900/40 border-rose-500/70 text-rose-300' 
                : 'bg-[#333342] hover:bg-[#3d3d4e] border-[#48485c] text-white'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Presets</span>
          </button>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#24242e] border border-[#444458] rounded-xl max-w-md w-full p-6 shadow-2xl text-left">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">🍍</span>
              <div>
                <h2 className="text-xl font-bold text-white">HandBrake</h2>
                <p className="text-xs text-[#9d9dae]">The open source video transcoder</p>
              </div>
            </div>
            <p className="text-xs text-[#c4c4d4] leading-relaxed mb-4">
              HandBrake is a tool for converting video from nearly any format to a selection of modern, widely supported codecs. This web application brings the full HandBrake workflow to your browser with interactive presets, filter simulation, queue management, and HandBrakeCLI command generation.
            </p>
            <div className="bg-[#1a1a22] border border-[#363644] rounded p-3 text-[11px] space-y-1 mb-5 text-[#8f8fa4]">
              <div><strong className="text-[#c4c4d4]">Version:</strong> 2.0.0 Web Edition</div>
              <div><strong className="text-[#c4c4d4]">Engine:</strong> libhb Web Transcoder Pipeline</div>
              <div><strong className="text-[#c4c4d4]">License:</strong> GNU General Public License v2</div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAbout(false)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium text-xs shadow"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
