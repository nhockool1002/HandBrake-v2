import React, { useState, useEffect, useRef } from 'react';
import { 
  VideoSource, 
  TranscodeSettings, 
  TranscodePreset, 
  QueueJob, 
  ActivityLog, 
  PresetCategory 
} from './types';
import { BUILTIN_PRESETS } from './data/presets';
import { SAMPLE_VIDEOS } from './data/sampleVideos';
import { generateCliCommand, formatTime } from './utils/handbrakeCli';
import { Header } from './components/Header';
import { SourceBar } from './components/SourceBar';
import { SettingsNotebook } from './components/SettingsNotebook';
import { DestinationBar } from './components/DestinationBar';
import { PresetsDrawer } from './components/PresetsDrawer';
import { QueueDrawer } from './components/QueueDrawer';
import { PreviewModal } from './components/PreviewModal';
import { ActivityLogModal } from './components/ActivityLogModal';
import { OpenSourceModal } from './components/OpenSourceModal';

export const App: React.FC = () => {
  // Source State
  const [source, setSource] = useState<VideoSource | null>(SAMPLE_VIDEOS[0]);
  const [presets, setPresets] = useState<TranscodePreset[]>(() => {
    const saved = localStorage.getItem('handbrake_presets_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return BUILTIN_PRESETS;
  });

  const [currentPreset, setCurrentPreset] = useState<TranscodePreset>(BUILTIN_PRESETS[0]);
  const [settings, setSettings] = useState<TranscodeSettings>(BUILTIN_PRESETS[0].settings);
  const [destination, setDestination] = useState<string>(() => {
    return `Big_Buck_Bunny_1080p_60fps-transcoded.mp4`;
  });

  // Modals and Drawers
  const [presetsDrawerOpen, setPresetsDrawerOpen] = useState(false);
  const [queueDrawerOpen, setQueueDrawerOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [activityLogModalOpen, setActivityLogModalOpen] = useState(false);
  const [openSourceModalOpen, setOpenSourceModalOpen] = useState(false);

  // Queue & Encoding State
  const [queue, setQueue] = useState<QueueJob[]>([]);
  const [isEncoding, setIsEncoding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeJobId, setActiveJobId] = useState<string | null>(null);

  // Activity Logs
  const [logs, setLogs] = useState<ActivityLog[]>([
    {
      id: 'log-0',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'HandBrake-Dev1002 2.0.0 initialized.'
    },
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'libhb: initialized 8 worker threads for CPU software encoding'
    },
    {
      id: 'log-2',
      timestamp: new Date().toLocaleTimeString(),
      level: 'info',
      message: 'Scan: loaded Big_Buck_Bunny_1080p_60fps.mp4 (1920x1080 @ 60fps)'
    }
  ]);

  // Synchronize destination extension when container changes
  useEffect(() => {
    setDestination((prev) => {
      const base = prev.replace(/\.[^/.]+$/, '');
      return `${base}.${settings.container}`;
    });
  }, [settings.container]);

  // Synchronize destination filename when source changes
  useEffect(() => {
    if (source) {
      const base = source.name.replace(/\.[^/.]+$/, '');
      setDestination(`${base}-transcoded.${settings.container}`);
    }
  }, [source]);

  const addLog = (message: string, level: 'info' | 'warn' | 'error' | 'debug' = 'info') => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      message
    };
    setLogs((prev) => [...prev, newLog]);
  };

  // Preset Selection
  const handleSelectPreset = (preset: TranscodePreset) => {
    setCurrentPreset(preset);
    setSettings({ ...preset.settings });
    addLog(`Preset selected: ${preset.name} (${preset.category})`);
  };

  const handleSelectPresetId = (id: string) => {
    const found = presets.find((p) => p.id === id);
    if (found) {
      handleSelectPreset(found);
    }
  };

  const handleSaveCustomPreset = (name: string, category: PresetCategory, description: string) => {
    const newPreset: TranscodePreset = {
      id: `custom-${Date.now()}`,
      name,
      category,
      description: description || 'User customized transcode profile',
      settings: { ...settings }
    };
    const updated = [...presets, newPreset];
    setPresets(updated);
    setCurrentPreset(newPreset);
    localStorage.setItem('handbrake_presets_v2', JSON.stringify(updated));
    addLog(`Created new custom preset: ${name}`);
  };

  const handleDeleteCustomPreset = (id: string) => {
    const updated = presets.filter((p) => p.id !== id);
    setPresets(updated);
    localStorage.setItem('handbrake_presets_v2', JSON.stringify(updated));
    addLog(`Deleted custom preset`);
  };

  const handleImportPresets = (imported: TranscodePreset[]) => {
    setPresets(imported);
    localStorage.setItem('handbrake_presets_v2', JSON.stringify(imported));
    addLog(`Imported ${imported.length} presets from file`);
  };

  // Add Current Job to Queue
  const handleAddToQueue = (): string => {
    if (!source) {
      alert('Please open a video source first.');
      return '';
    }

    const newJobId = `job-${Date.now()}`;
    const newJob: QueueJob = {
      id: newJobId,
      sourceName: source.name,
      sourceUrl: source.url,
      presetName: currentPreset.name,
      destination: destination,
      settings: { ...settings },
      status: 'queued',
      progress: 0,
      fps: 0,
      eta: '--:--',
      elapsed: '00:00:00',
      outputSize: 'Calculating...',
      outputBlobUrl: source.url,
      cliCommand: generateCliCommand(source, settings, destination),
      log: []
    };

    setQueue((prev) => [...prev, newJob]);
    addLog(`Added job to queue: "${source.name}" -> "${destination}" [Preset: ${currentPreset.name}]`);
    return newJobId;
  };

  // Encoding Simulation Engine
  const encodeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startEncodingJob = (jobId: string) => {
    setIsEncoding(true);
    setIsPaused(false);
    setActiveJobId(jobId);

    setQueue((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'encoding', progress: 0 } : j))
    );

    addLog(`Starting encode job ${jobId}...`);
    addLog(`libhb: sync audio & video streams`);
    addLog(`x264 [info]: profile High, level 4.0, 4:2:0, 8-bit`);
    addLog(`x264 [info]: 264 - core 164 r3108 - H.264/MPEG-4 AVC codec`);

    let currentProgress = 0;
    let secondsElapsed = 0;

    if (encodeTimerRef.current) clearInterval(encodeTimerRef.current);

    encodeTimerRef.current = setInterval(() => {
      secondsElapsed += 0.5;
      currentProgress += Math.random() * 4 + 2;

      const randomFps = Math.floor(Math.random() * 25 + 65);
      const remainingSeconds = Math.max(1, Math.round((100 - currentProgress) / 4));
      const etaStr = formatTime(remainingSeconds).substring(3);
      const elapsedStr = formatTime(Math.round(secondsElapsed));

      if (currentProgress >= 100) {
        clearInterval(encodeTimerRef.current!);
        encodeTimerRef.current = null;

        setQueue((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  status: 'completed',
                  progress: 100,
                  fps: randomFps,
                  eta: '00:00',
                  elapsed: elapsedStr,
                  outputSize: '42.8 MB'
                }
              : j
          )
        );

        setIsEncoding(false);
        setActiveJobId(null);
        addLog(`mux: writing moov atom at beginning of file`);
        addLog(`Encode job completed successfully: output ready for download.`, 'info');
      } else {
        setQueue((prev) =>
          prev.map((j) =>
            j.id === jobId
              ? {
                  ...j,
                  progress: Math.min(99.5, currentProgress),
                  fps: randomFps,
                  eta: etaStr,
                  elapsed: elapsedStr
                }
              : j
          )
        );
      }
    }, 400);
  };

  const handleStartEncode = () => {
    // Check if there are queued items
    const nextQueued = queue.find((j) => j.status === 'queued');
    if (nextQueued) {
      startEncodingJob(nextQueued.id);
    } else {
      // Add current settings as a job and run immediately
      const newId = handleAddToQueue();
      if (newId) {
        setTimeout(() => startEncodingJob(newId), 100);
      }
    }
  };

  const handlePauseEncode = () => {
    if (encodeTimerRef.current) {
      clearInterval(encodeTimerRef.current);
      encodeTimerRef.current = null;
      setIsPaused(true);
      addLog(`Encode paused.`);
    } else if (activeJobId && isPaused) {
      setIsPaused(false);
      startEncodingJob(activeJobId);
      addLog(`Encode resumed.`);
    }
  };

  const handleStopEncode = () => {
    if (encodeTimerRef.current) {
      clearInterval(encodeTimerRef.current);
      encodeTimerRef.current = null;
    }
    setIsEncoding(false);
    setIsPaused(false);
    if (activeJobId) {
      setQueue((prev) =>
        prev.map((j) => (j.id === activeJobId ? { ...j, status: 'cancelled' } : j))
      );
      addLog(`Encode stopped by user.`, 'warn');
      setActiveJobId(null);
    }
  };

  const handleClearCompleted = () => {
    setQueue((prev) => prev.filter((j) => j.status !== 'completed'));
  };

  const handleRemoveJob = (id: string) => {
    if (activeJobId === id) {
      handleStopEncode();
    }
    setQueue((prev) => prev.filter((j) => j.id !== id));
  };

  const currentCli = source 
    ? generateCliCommand(source, settings, destination) 
    : 'HandBrakeCLI -i "input.mp4" -o "output.mp4"';

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#1a1a22] text-[#e0e0e8]">
      {/* Top Main Toolbar & Menu Bar */}
      <Header
        onOpenSourceClick={() => setOpenSourceModalOpen(true)}
        onAddToQueue={handleAddToQueue}
        onStartEncode={handleStartEncode}
        onPauseEncode={handlePauseEncode}
        onStopEncode={handleStopEncode}
        onToggleQueue={() => setQueueDrawerOpen(true)}
        onTogglePresets={() => setPresetsDrawerOpen(!presetsDrawerOpen)}
        onOpenPreview={() => setPreviewModalOpen(true)}
        onOpenActivityLog={() => setActivityLogModalOpen(true)}
        isEncoding={isEncoding}
        isPaused={isPaused}
        queueCount={queue.filter((j) => j.status === 'queued').length}
        presetsOpen={presetsDrawerOpen}
      />

      {/* Source Bar */}
      <SourceBar
        source={source}
        currentPreset={currentPreset}
        onOpenSourceModal={() => setOpenSourceModalOpen(true)}
        onSaveNewPreset={() => setPresetsDrawerOpen(true)}
        onSelectPresetId={handleSelectPresetId}
        presets={presets}
      />

      {/* Main Workspace: Settings Notebook & Presets Sidebar Drawer */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <SettingsNotebook
          settings={settings}
          onChange={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
          source={source}
        />

        <PresetsDrawer
          isOpen={presetsDrawerOpen}
          onClose={() => setPresetsDrawerOpen(false)}
          presets={presets}
          activePresetId={currentPreset.id}
          onSelectPreset={handleSelectPreset}
          onSaveCustomPreset={handleSaveCustomPreset}
          onDeleteCustomPreset={handleDeleteCustomPreset}
          onImportPresets={handleImportPresets}
        />
      </div>

      {/* Bottom Destination Bar */}
      <DestinationBar
        destination={destination}
        onDestinationChange={setDestination}
        cliCommand={currentCli}
      />

      {/* Modals & Floating Dialogs */}
      <QueueDrawer
        isOpen={queueDrawerOpen}
        onClose={() => setQueueDrawerOpen(false)}
        queue={queue}
        onStartQueue={handleStartEncode}
        onPauseQueue={handlePauseEncode}
        onClearCompleted={handleClearCompleted}
        onRemoveJob={handleRemoveJob}
        isEncoding={isEncoding}
        isPaused={isPaused}
      />

      <PreviewModal
        isOpen={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        source={source}
        settings={settings}
      />

      <ActivityLogModal
        isOpen={activityLogModalOpen}
        onClose={() => setActivityLogModalOpen(false)}
        logs={logs}
        onClearLogs={() => setLogs([])}
      />

      <OpenSourceModal
        isOpen={openSourceModalOpen}
        onClose={() => setOpenSourceModalOpen(false)}
        onSelectSource={(newSource) => {
          setSource(newSource);
          addLog(`Opened new source: ${newSource.name} (${newSource.width}x${newSource.height})`);
        }}
        currentSourceId={source?.id}
      />
    </div>
  );
};
export default App;
