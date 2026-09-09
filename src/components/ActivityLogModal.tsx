import React, { useState } from 'react';
import { ActivityLog } from '../types';
import { Terminal, Copy, Check, Trash2, Search, X } from 'lucide-react';

interface ActivityLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: ActivityLog[];
  onClearLogs: () => void;
}

export const ActivityLogModal: React.FC<ActivityLogModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs
}) => {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('');

  if (!isOpen) return null;

  const filteredLogs = logs.filter((l) =>
    l.message.toLowerCase().includes(filter.toLowerCase())
  );

  const handleCopy = () => {
    const text = logs.map((l) => `[${l.timestamp}] ${l.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-[#1e1e26] border border-[#404052] rounded-xl max-w-4xl w-full h-[580px] flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Header */}
        <div className="px-5 py-3 border-b border-[#363646] bg-[#252532] flex items-center justify-between font-sans">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Activity Log & libhb Diagnostic Console</h2>
          </div>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-[#77778a]" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#1b1b22] border border-[#3e3e50] rounded pl-8 pr-2 py-1 text-white text-xs w-44 focus:outline-hidden focus:border-rose-500"
              />
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 bg-[#2d2d3c] hover:bg-[#38384a] text-white px-2.5 py-1 rounded border border-[#444456]"
              title="Copy entire log"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-blue-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClearLogs}
              className="p-1.5 hover:bg-[#2d2d3c] rounded text-[#8e8ea2] hover:text-rose-400"
              title="Clear log window"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1 hover:bg-[#38384a] rounded text-[#8e8ea2] hover:text-white ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Log Viewer Terminal Body */}
        <div className="flex-1 bg-[#121218] p-4 overflow-y-auto space-y-1 text-[11px] leading-relaxed select-text">
          {filteredLogs.length === 0 ? (
            <div className="text-[#555566] text-center py-10 font-sans">
              No activity log entries found.
            </div>
          ) : (
            filteredLogs.map((log) => {
              let colorClass = 'text-[#b0b0c2]';
              if (log.level === 'warn') colorClass = 'text-amber-400';
              if (log.level === 'error') colorClass = 'text-rose-400';
              if (log.level === 'debug') colorClass = 'text-[#77778a]';

              return (
                <div key={log.id} className="flex space-x-3 hover:bg-white/5 py-0.5 rounded px-1">
                  <span className="text-[#646478] shrink-0">[{log.timestamp}]</span>
                  <span className={colorClass}>{log.message}</span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-[#20202a] border-t border-[#343444] flex items-center justify-between text-[11px] text-[#8e8ea2] font-sans">
          <span>Total lines: {logs.length}</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1 bg-[#323242] hover:bg-[#3d3d50] text-white rounded font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
