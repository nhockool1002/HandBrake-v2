import React, { useState } from 'react';
import { Folder, Copy, Check, Terminal } from 'lucide-react';

interface DestinationBarProps {
  destination: string;
  onDestinationChange: (newDest: string) => void;
  cliCommand: string;
}

export const DestinationBar: React.FC<DestinationBarProps> = ({
  destination,
  onDestinationChange,
  cliCommand
}) => {
  const [copied, setCopied] = useState(false);
  const [showCliModal, setShowCliModal] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#202028] border-t border-[#343444] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs select-none">
      {/* Destination File Path */}
      <div className="flex items-center space-x-2.5 flex-1 min-w-[280px]">
        <span className="text-[#9a9ab0] font-medium shrink-0">Save As:</span>
        <input
          id="input-destination-filename"
          type="text"
          value={destination}
          onChange={(e) => onDestinationChange(e.target.value)}
          className="flex-1 bg-[#191922] border border-[#3e3e50] rounded px-3 py-1.5 text-white font-mono text-xs focus:outline-hidden focus:border-rose-500"
          placeholder="destination_file.mp4"
        />
        <button
          onClick={() => {
            const ext = destination.split('.').pop() || 'mp4';
            const base = destination.replace(/\.[^/.]+$/, '');
            const newName = prompt('Enter new output filename:', base);
            if (newName) {
              onDestinationChange(`${newName.trim()}.${ext}`);
            }
          }}
          className="flex items-center space-x-1.5 bg-[#2c2c3a] hover:bg-[#38384a] text-white px-3 py-1.5 rounded border border-[#444458] shrink-0 font-medium"
        >
          <Folder className="w-3.5 h-3.5 text-amber-400" />
          <span>Browse...</span>
        </button>
      </div>

      {/* CLI Command Generator Button */}
      <div className="flex items-center space-x-2 shrink-0">
        <button
          id="btn-view-cli"
          onClick={() => setShowCliModal(true)}
          className="flex items-center space-x-1.5 bg-[#2a2a36] hover:bg-[#353544] text-[#cfcfe0] hover:text-white px-3 py-1.5 rounded border border-[#404052] font-medium transition-colors"
          title="View equivalent HandBrakeCLI command line"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
          <span>HandBrakeCLI</span>
        </button>

        <button
          id="btn-copy-cli"
          onClick={handleCopy}
          className="flex items-center space-x-1.5 bg-[#2a2a36] hover:bg-[#353544] text-[#cfcfe0] hover:text-white px-3 py-1.5 rounded border border-[#404052] font-medium transition-colors"
          title="Copy command to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-blue-400" />
              <span>Copy CLI</span>
            </>
          )}
        </button>
      </div>

      {/* CLI Command Modal Dialog */}
      {showCliModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-[#24242e] border border-[#444458] rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#383848] pb-3">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Generated HandBrakeCLI Command</h3>
              </div>
              <button
                onClick={() => setShowCliModal(false)}
                className="text-[#88889a] hover:text-white text-lg font-bold"
              >
                ×
              </button>
            </div>

            <p className="text-xs text-[#a0a0b2]">
              You can execute this command directly on any system where the official HandBrakeCLI binary is installed:
            </p>

            <div className="p-3 bg-[#16161e] border border-[#343444] rounded font-mono text-xs text-emerald-300 break-all select-all max-h-48 overflow-y-auto leading-relaxed">
              {cliCommand}
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[11px] text-[#707084]">All active filters, dimensions, audio tracks & presets included</span>
              <div className="flex space-x-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center space-x-1.5 bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-1.5 rounded text-xs font-semibold shadow"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied to Clipboard' : 'Copy Command'}</span>
                </button>
                <button
                  onClick={() => setShowCliModal(false)}
                  className="bg-[#333342] hover:bg-[#3d3d4e] text-white px-3.5 py-1.5 rounded text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
