import React, { useState } from 'react';
import { VideoSource } from '../../types';
import { formatTime } from '../../utils/handbrakeCli';
import { BookOpen, Edit3, Download } from 'lucide-react';

interface ChaptersTabProps {
  source: VideoSource | null;
}

export const ChaptersTab: React.FC<ChaptersTabProps> = ({ source }) => {
  const [chapters, setChapters] = useState(source?.chapters || []);
  const [includeMarkers, setIncludeMarkers] = useState(true);

  const updateTitle = (index: number, newTitle: string) => {
    const updated = [...chapters];
    updated[index].name = newTitle;
    setChapters(updated);
  };

  const handleExportChapters = () => {
    const text = chapters.map((c, i) => `CHAPTER${(i + 1).toString().padStart(2, '0')}=${formatTime(c.start)}.000\nCHAPTER${(i + 1).toString().padStart(2, '0')}NAME=${c.name}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${source?.name || 'video'}_chapters.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-5 text-xs text-[#d0d0de] space-y-6 max-w-5xl">
      <div className="bg-[#23232c] border border-[#383848] rounded-lg p-4 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#3c3c4e] pb-2">
          <h3 className="font-semibold text-white text-sm flex items-center space-x-1.5">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span>Chapter Markers & Titles</span>
          </h3>

          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeMarkers}
                onChange={(e) => setIncludeMarkers(e.target.checked)}
                className="rounded bg-[#1b1b22] border-[#444458] text-rose-600 focus:ring-0 w-4 h-4"
              />
              <span className="font-medium text-white">Create Chapter Markers</span>
            </label>

            <button
              onClick={handleExportChapters}
              className="flex items-center space-x-1.5 text-[11px] text-white bg-[#323242] hover:bg-[#3e3e50] px-2.5 py-1 rounded border border-[#48485e]"
              title="Export chapters as standard OGG/Matroska chapter text format"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Export Chapter File</span>
            </button>
          </div>
        </div>

        {chapters.length > 0 ? (
          <div className="overflow-x-auto border border-[#383848] rounded bg-[#181822]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#20202c] border-b border-[#323242] text-[11px] text-[#8e8ea4]">
                  <th className="p-2.5 w-16">Chapter</th>
                  <th className="p-2.5 w-32">Start Time</th>
                  <th className="p-2.5 w-32">Duration</th>
                  <th className="p-2.5">Chapter Title</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2a2a38]">
                {chapters.map((ch, idx) => (
                  <tr key={ch.id} className="hover:bg-[#20202e] transition-colors">
                    <td className="p-2.5 font-mono text-purple-400 font-bold">{ch.id}</td>
                    <td className="p-2.5 font-mono text-[#a0a0b8]">{formatTime(ch.start)}</td>
                    <td className="p-2.5 font-mono text-[#a0a0b8]">{formatTime(ch.duration)}</td>
                    <td className="p-2.5">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={ch.name}
                          onChange={(e) => updateTitle(idx, e.target.value)}
                          className="w-full max-w-md bg-[#252533] border border-[#404052] rounded px-2.5 py-1 text-white text-xs focus:outline-hidden focus:border-rose-500"
                        />
                        <Edit3 className="w-3.5 h-3.5 text-[#6c6c80] shrink-0" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-[#1a1a24] rounded border border-dashed border-[#383848] text-[#8e8ea2]">
            <p>No chapter markers found in this source.</p>
          </div>
        )}
      </div>
    </div>
  );
};
