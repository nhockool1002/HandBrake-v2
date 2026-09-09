import React from 'react';
import { QueueJob } from '../types';
import { 
  ListOrdered, 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  CheckCircle2, 
  Clock, 
  Film,
  X
} from 'lucide-react';

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: QueueJob[];
  onStartQueue: () => void;
  onPauseQueue: () => void;
  onClearCompleted: () => void;
  onRemoveJob: (id: string) => void;
  isEncoding: boolean;
  isPaused: boolean;
}

export const QueueDrawer: React.FC<QueueDrawerProps> = ({
  isOpen,
  onClose,
  queue,
  onStartQueue,
  onPauseQueue,
  onClearCompleted,
  onRemoveJob,
  isEncoding,
  isPaused
}) => {
  if (!isOpen) return null;

  const completedCount = queue.filter((j) => j.status === 'completed').length;
  const pendingCount = queue.filter((j) => j.status === 'queued').length;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none text-xs">
      <div className="bg-[#22222c] border border-[#404052] rounded-xl max-w-4xl w-full h-[580px] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-[#363646] bg-[#282834] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <ListOrdered className="w-5 h-5 text-indigo-400" />
            <h2 className="text-sm font-bold text-white">Transcode Queue</h2>
            <span className="text-[11px] bg-[#363646] text-[#b0b0c2] px-2 py-0.5 rounded-full font-mono">
              {queue.length} job(s)
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {!isEncoding ? (
              <button
                onClick={onStartQueue}
                disabled={pendingCount === 0}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white px-3 py-1 rounded font-medium shadow"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Start Queue</span>
              </button>
            ) : (
              <button
                onClick={onPauseQueue}
                className="flex items-center space-x-1.5 bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded font-medium shadow"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
            )}

            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-[#9a9ab0] hover:text-white px-2 py-1 bg-[#323242] rounded border border-[#424254]"
              >
                Clear Completed
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1 hover:bg-[#38384a] rounded text-[#8e8ea2] hover:text-white ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Queue Items Table / List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#1c1c24]">
          {queue.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#707084] space-y-2">
              <Film className="w-12 h-12 text-[#404052]" />
              <p className="font-medium text-sm">The queue is currently empty</p>
              <p className="text-xs">Click "Add to Queue" on the main toolbar to queue up the current video with selected settings.</p>
            </div>
          ) : (
            queue.map((job, idx) => {
              const isCurrent = job.status === 'encoding';
              return (
                <div
                  key={job.id}
                  className={`p-3.5 rounded-lg border transition-all ${
                    isCurrent
                      ? 'bg-[#252535] border-rose-500/70 shadow-md'
                      : job.status === 'completed'
                      ? 'bg-[#1e2422] border-emerald-800/40'
                      : 'bg-[#22222d] border-[#363646]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] text-[#78788a]">#{idx + 1}</span>
                        <h4 className="font-semibold text-white truncate max-w-md" title={job.sourceName}>
                          {job.sourceName}
                        </h4>
                        <span className="text-[10px] bg-[#323242] px-2 py-0.5 rounded text-[#a4a4ba]">
                          Preset: {job.presetName}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#8e8ea2] truncate font-mono">
                        Destination: <span className="text-[#c0c0d4]">{job.destination}</span>
                      </div>
                    </div>

                    {/* Status badge & Actions */}
                    <div className="flex items-center space-x-2 shrink-0">
                      {job.status === 'completed' && (
                        <span className="flex items-center space-x-1 text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded font-medium text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Finished</span>
                        </span>
                      )}
                      {job.status === 'encoding' && (
                        <span className="flex items-center space-x-1 text-rose-400 bg-rose-950/60 border border-rose-800/60 px-2 py-0.5 rounded font-medium text-[11px] animate-pulse">
                          <span>Encoding...</span>
                        </span>
                      )}
                      {job.status === 'queued' && (
                        <span className="flex items-center space-x-1 text-indigo-400 bg-indigo-950/60 border border-indigo-800/60 px-2 py-0.5 rounded font-medium text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Queued</span>
                        </span>
                      )}

                      {/* Download button for completed */}
                      {job.status === 'completed' && job.outputBlobUrl && (
                        <a
                          href={job.outputBlobUrl}
                          download={job.destination}
                          className="flex items-center space-x-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded font-medium shadow transition-colors"
                          title="Download transcoded output file"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </a>
                      )}

                      {/* Remove job */}
                      <button
                        onClick={() => onRemoveJob(job.id)}
                        className="p-1.5 text-[#8e8ea2] hover:text-rose-400 hover:bg-[#303040] rounded transition-colors"
                        title="Remove from queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Progress Bar & Encoding Stats */}
                  {(job.status === 'encoding' || job.status === 'completed') && (
                    <div className="mt-3 space-y-1.5">
                      <div className="w-full bg-[#16161e] rounded-full h-2 overflow-hidden border border-[#303040]">
                        <div
                          className={`h-full transition-all duration-300 ${
                            job.status === 'completed' ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${job.progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#8e8ea2] font-mono">
                        <span>{job.progress.toFixed(1)}% complete</span>
                        {job.status === 'encoding' && (
                          <div className="flex space-x-3 text-[10px]">
                            <span>Speed: <strong className="text-white">{job.fps} fps</strong></span>
                            <span>Elapsed: <strong className="text-white">{job.elapsed}</strong></span>
                            <span>ETA: <strong className="text-amber-400">{job.eta}</strong></span>
                          </div>
                        )}
                        {job.status === 'completed' && (
                          <span className="text-emerald-400">File size: {job.outputSize}</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="px-5 py-2.5 bg-[#20202a] border-t border-[#343444] flex items-center justify-between text-[11px] text-[#8e8ea2]">
          <span>libhb Queue Manager • Auto-shutdown on queue complete: Off</span>
          <button
            onClick={onClose}
            className="px-4 py-1 bg-[#30303e] hover:bg-[#3c3c4e] text-white rounded font-medium text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
