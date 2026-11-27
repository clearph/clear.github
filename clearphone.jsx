import React, { useState, useEffect, useRef } from 'react';
import {
  Wifi, Bluetooth, Plane, Flashlight, Sun, Cloud, CloudRain,
  Settings, Camera, MessageSquare, Mail, Calendar, Image, Music,
  Compass, Calculator, Video, FileText, Wallet, Globe, Users,
  Activity, Folder, Package, CheckSquare, Phone, ChevronDown,
  ChevronLeft, Play, Pause, SkipBack, SkipForward, Wind, Droplets,
  Eye, Moon,
} from 'lucide-react';

/* ---------- tiny hardware glyphs (hand-drawn, no icon-name risk) ---------- */

function SignalBars() {
  const heights = [4, 6, 8, 10];
  return (
    <div className="flex items-end gap-0.5" style={{ height: 10 }}>
      {heights.map((h, i) => (
        <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: '#101820' }} />
      ))}
    </div>
  );
}

function BatteryGlyph({ pct }) {
  return (
    <div className="flex items-center gap-0.5">
      <div className="relative" style={{ width: 22, height: 11, border: '1.4px solid #101820', borderRadius: 3 }}>
        <div style={{ position: 'absolute', top: 1.5, left: 1.5, bottom: 1.5, width: `${pct}%`, background: '#101820', borderRadius: 1 }} />
      </div>
      <div style={{ width: 1.5, height: 5, background: '#101820', borderRadius: 1 }} />
    </div>
  );
}

/* ---------------------------- shared glass bits ---------------------------- */

function GlassToggle({ label, Icon, on, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl active:scale-95 transition-transform"
    >
      <span className="flex items-center gap-3 text-slate-800 text-sm font-medium">
        {Icon && <Icon size={16} className="text-violet-500" strokeWidth={2.2} />}
        {label}
      </span>
      <span className={`relative w-10 h-6 rounded-full transition-colors duration-200 ${on ? 'bg-violet-400' : 'bg-slate-900/15'}`}>
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${on ? 'translate-x-4' : 'translate-x-0'}`} />
      </span>
    </button>
  );
}

function GlassSlider({ value, onChange, Icon }) {
  const trackRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  const updateFromClientX = (clientX) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    let p = (clientX - rect.left) / rect.width;
    p = Math.max(0, Math.min(1, p));
    onChange(Math.round(p * 100));
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={(e) => { setDragging(true); e.currentTarget.setPointerCapture(e.pointerId); updateFromClientX(e.clientX); }}
      onPointerMove={(e) => { if (dragging) updateFromClientX(e.clientX); }}
      onPointerUp={() => setDragging(false)}
      className="relative w-full h-8 rounded-full bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-y-0 left-0 bg-violet-300/70" style={{ width: `${value}%` }} />
      <div className="relative h-full flex items-center px-3 gap-2">
        {Icon && <Icon size={13} className="text-slate-700" strokeWidth={2.2} />}
      </div>
    </div>
  );
}

/* ------------------------------- status bar ------------------------------- */

function StatusBar({ timeStr, showControls, onOpenControlCenter }) {
  return (
    <div className="relative z-20 flex items-center justify-between px-5 pt-3.5 pb-1">
      <span className="text-slate-900 text-xs font-semibold tracking-wide" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        {timeStr}
      </span>
      <div className="flex items-center gap-1.5">
        <SignalBars />
        <Wifi size={13} className="text-slate-900" strokeWidth={2.3} />
        <BatteryGlyph pct={78} />
        {showControls && (
          <button
            onClick={onOpenControlCenter}
            aria-label="Control Center"
            className="ml-1 flex items-center justify-center rounded-full active:scale-90 transition-transform"
            style={{ width: 20, height: 20 }}
          >
            <ChevronDown size={13} className="text-slate-900" strokeWidth={2.3} />
          </button>
        )}
      </div>
    </div>
  );
}

/* -------------------------------- lock screen -------------------------------- */

function LockScreen({ timeStr, dateStr, trackRef, handleX, onHandleDown, onHandleMove, onHandleUp, HANDLE }) {
  return (
    <div className="relative z-10 h-full flex flex-col px-6 pt-6">
      <div className="flex-1" />
      <div className="text-center mb-2">
        <div className="text-slate-900 font-light leading-none" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 58, letterSpacing: -1 }}>
          {timeStr}
        </div>
        <div className="text-slate-500 text-sm mt-2 font-medium">{dateStr}</div>
      </div>
      <div className="flex-1" />

      <div className="space-y-2.5 mb-5">
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-400/30 flex items-center justify-center shrink-0">
            <Cloud size={15} className="text-teal-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-800 text-xs font-semibold">Weather</div>
            <div className="text-slate-500 text-xs truncate">Clear skies, 72° in Alderson</div>
          </div>
        </div>
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-400/30 flex items-center justify-center shrink-0">
            <MessageSquare size={14} className="text-violet-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-slate-800 text-xs font-semibold">Messages</div>
            <div className="text-slate-500 text-xs truncate">2 new messages</div>
          </div>
        </div>
      </div>

      <div className="mb-3 text-center">
        <span className="text-xs font-semibold shimmer-sweep bg-gradient-to-r from-slate-900 via-violet-400 to-slate-900 bg-clip-text text-transparent">
          slide to unlock
        </span>
      </div>
      <div ref={trackRef} className="relative w-full rounded-full bg-white/40 backdrop-blur-md ring-1 ring-slate-900/10 mb-7" style={{ height: HANDLE }}>
        <div
          onPointerDown={onHandleDown}
          onPointerMove={onHandleMove}
          onPointerUp={onHandleUp}
          className="absolute top-0 rounded-full bg-white shadow-md flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{ left: handleX, width: HANDLE, height: HANDLE }}
        >
          <ChevronDown size={20} className="text-violet-500 -rotate-90" strokeWidth={2.4} />
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- home screen -------------------------------- */

function HomeScreen({ gridApps, dockApps, onOpenApp }) {
  return (
    <div className="relative z-10 h-full flex flex-col px-4 pt-3 pb-1">
      <button
        onClick={() => onOpenApp('weather')}
        className="text-left bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-3xl px-4 py-3 mb-3 flex items-center justify-between active:scale-95 transition-transform"
      >
        <div>
          <div className="text-slate-500 text-xs font-medium mb-0.5">Alderson, WV</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-slate-900 text-3xl font-light" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>72°</span>
            <span className="text-slate-500 text-xs">Partly clear</span>
          </div>
        </div>
        <Cloud size={30} className="text-teal-500" strokeWidth={1.6} />
      </button>

      <div className="grid grid-cols-4 gap-x-2 gap-y-3 flex-1 content-start">
        {gridApps.map(({ id, label, Icon, action }) => (
          <button key={id} onClick={() => action && onOpenApp(id)} className="flex flex-col items-center gap-1 active:scale-90 transition-transform">
            <div className="w-12 h-12 rounded-2xl bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 flex items-center justify-center">
              <Icon size={19} className="text-slate-700" strokeWidth={1.8} />
            </div>
            <span className="text-slate-600 text-xs font-medium truncate w-full text-center">{label}</span>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 py-2">
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900/60" />
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900/20" />
      </div>

      <div className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-3xl px-3 py-2.5 flex items-center justify-between mb-2">
        {dockApps.map(({ id, label, Icon, action }) => (
          <button key={id} onClick={() => action && onOpenApp(id)} aria-label={label} className="w-11 h-11 rounded-2xl bg-white/60 flex items-center justify-center active:scale-90 transition-transform">
            <Icon size={19} className="text-slate-700" strokeWidth={1.8} />
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ settings screen ------------------------------ */

function SettingsScreen({ toggles, onToggle, onBack, brightness, onBrightness }) {
  return (
    <div className="relative z-10 h-full flex flex-col px-5 pt-3 pb-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/50 ring-1 ring-slate-900/10 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft size={16} className="text-slate-700" />
        </button>
        <span className="text-slate-900 text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Settings</span>
      </div>
      <div className="space-y-2.5">
        <GlassToggle label="Airplane Mode" Icon={Plane} on={toggles.airplane} onClick={() => onToggle('airplane')} />
        <GlassToggle label="Wi-Fi" Icon={Wifi} on={toggles.wifi} onClick={() => onToggle('wifi')} />
        <GlassToggle label="Bluetooth" Icon={Bluetooth} on={toggles.bluetooth} onClick={() => onToggle('bluetooth')} />
        <GlassToggle label="Do Not Disturb" Icon={Moon} on={toggles.dnd} onClick={() => onToggle('dnd')} />
        <div className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2 text-slate-800 text-sm font-medium mb-2.5">
            <Sun size={16} className="text-orange-400" />
            Brightness
          </div>
          <GlassSlider value={brightness} onChange={onBrightness} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- weather screen ------------------------------- */

function WeatherScreen({ onBack, hourly }) {
  const details = [
    { label: 'Wind', value: '6 mph', Icon: Wind },
    { label: 'Humidity', value: '48%', Icon: Droplets },
    { label: 'UV Index', value: 'Low', Icon: Sun },
    { label: 'Visibility', value: '10 mi', Icon: Eye },
  ];
  return (
    <div className="relative z-10 h-full flex flex-col px-5 pt-3 pb-4 overflow-y-auto">
      <div className="flex items-center gap-2 mb-4">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/50 ring-1 ring-slate-900/10 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft size={16} className="text-slate-700" />
        </button>
        <span className="text-slate-900 text-lg font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Alderson, WV</span>
      </div>

      <div className="text-center mb-4">
        <Cloud size={44} className="text-teal-500 mx-auto mb-1" strokeWidth={1.5} />
        <div className="text-slate-900 font-light" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 50 }}>72°</div>
        <div className="text-slate-500 text-sm">Partly clear · H:78° L:61°</div>
      </div>

      <div className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl px-3 py-3 mb-3">
        <div className="flex justify-between">
          {hourly.map((h, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span className="text-slate-500 text-xs">{h.t}</span>
              <h.Icon size={16} className="text-teal-500" />
              <span className="text-slate-800 text-xs font-medium">{h.temp}°</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {details.map((d) => (
          <div key={d.label} className="bg-white/50 backdrop-blur-md ring-1 ring-slate-900/10 rounded-2xl px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-1.5">
              <d.Icon size={12} />
              {d.label}
            </div>
            <div className="text-slate-900 text-base font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* -------------------------------- music screen -------------------------------- */

function MusicScreen({ onBack, isPlaying, onTogglePlay, progress }) {
  return (
    <div className="relative z-10 h-full flex flex-col px-6 pt-3 pb-6">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="w-8 h-8 rounded-full bg-white/50 ring-1 ring-slate-900/10 flex items-center justify-center active:scale-90 transition-transform">
          <ChevronLeft size={16} className="text-slate-700" />
        </button>
        <span className="text-slate-900 text-sm font-semibold uppercase" style={{ letterSpacing: 1 }}>Now Playing</span>
      </div>

      <div
        className="w-full aspect-square rounded-3xl mb-6 ring-1 ring-slate-900/10"
        style={{ background: 'linear-gradient(135deg, #5eead4 0%, #a78bfa 50%, #fdba74 100%)' }}
      />

      <div className="mb-5">
        <div className="text-slate-900 text-xl font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Frequency Drift</div>
        <div className="text-slate-500 text-sm">Glass Horizon</div>
      </div>

      <div className="mb-6">
        <div className="w-full h-1.5 rounded-full bg-slate-900/10 overflow-hidden">
          <div className="h-full rounded-full bg-violet-400" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex items-center justify-center gap-8">
        <button className="active:scale-90 transition-transform">
          <SkipBack size={22} className="text-slate-700" fill="currentColor" />
        </button>
        <button onClick={onTogglePlay} className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center active:scale-90 transition-transform">
          {isPlaying ? (
            <Pause size={22} className="text-white" fill="currentColor" />
          ) : (
            <Play size={22} className="text-white ml-0.5" fill="currentColor" />
          )}
        </button>
        <button className="active:scale-90 transition-transform">
          <SkipForward size={22} className="text-slate-700" fill="currentColor" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ control center ------------------------------ */

function ControlCenter({ toggles, onToggle, brightness, onBrightness, onClose }) {
  const items = [
    { key: 'airplane', label: 'Airplane', Icon: Plane },
    { key: 'wifi', label: 'Wi-Fi', Icon: Wifi },
    { key: 'bluetooth', label: 'Bluetooth', Icon: Bluetooth },
    { key: 'torch', label: 'Torch', Icon: Flashlight },
  ];
  return (
    <>
      <div className="absolute inset-0 z-40" onClick={onClose} />
      <div
        className="absolute top-12 right-3 z-50 rounded-3xl bg-white/70 backdrop-blur-xl ring-1 ring-slate-900/10 p-3 shadow-xl"
        style={{ width: 176 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="grid grid-cols-2 gap-2 mb-2.5">
          {items.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => onToggle(key)}
              className={`flex flex-col items-center justify-center gap-1 rounded-2xl py-2.5 active:scale-95 transition-transform ${toggles[key] ? 'bg-violet-400' : 'bg-white/60'}`}
            >
              <Icon size={16} className={toggles[key] ? 'text-white' : 'text-slate-700'} />
              <span className={`text-xs font-medium ${toggles[key] ? 'text-white' : 'text-slate-600'}`}>{label}</span>
            </button>
          ))}
        </div>
        <GlassSlider value={brightness} onChange={onBrightness} Icon={Sun} />
      </div>
    </>
  );
}

/* ------------------------------------ app ------------------------------------ */

export default function ClearOS() {
  const [time, setTime] = useState(new Date());
  const [screen, setScreen] = useState('lock');
  const [openApp, setOpenApp] = useState(null);
  const [ccOpen, setCcOpen] = useState(false);

  const [handleX, setHandleX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const HANDLE = 54;

  const [toggles, setToggles] = useState({ wifi: true, bluetooth: true, airplane: false, dnd: false, torch: false });
  const [brightness, setBrightness] = useState(72);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(28);

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isPlaying) return undefined;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.4)), 200);
    return () => clearInterval(id);
  }, [isPlaying]);

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600&family=Manrope:wght@400;500;600;700&display=swap';
    document.head.appendChild(link);
    return () => { if (link.parentNode) link.parentNode.removeChild(link); };
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const dateLong = time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const toggle = (key) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  const onHandleDown = (e) => {
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onHandleMove = (e) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - HANDLE / 2;
    const max = rect.width - HANDLE;
    x = Math.max(0, Math.min(max, x));
    setHandleX(x);
  };
  const onHandleUp = (e) => {
    e.stopPropagation();
    setDragging(false);
    const max = trackRef.current ? trackRef.current.offsetWidth - HANDLE : 200;
    if (handleX > max * 0.55 || handleX < 6) {
      setHandleX(max);
      setTimeout(() => { setScreen('home'); setHandleX(0); }, 180);
    } else {
      setHandleX(0);
    }
  };

  const homeIndicatorTap = () => {
    if (openApp) setOpenApp(null);
    else if (screen === 'home') { setScreen('lock'); setCcOpen(false); }
  };

  const gridApps = [
    { id: 'mail', label: 'Mail', Icon: Mail },
    { id: 'calendar', label: 'Calendar', Icon: Calendar },
    { id: 'photos', label: 'Photos', Icon: Image },
    { id: 'weather', label: 'Weather', Icon: Cloud, action: true },
    { id: 'maps', label: 'Maps', Icon: Compass },
    { id: 'settings', label: