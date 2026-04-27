import React from 'react';
import type { BrandBarProps, SecHeadProps } from '../types';

// --- SHARED ICONS ---
// We keep these internal to this file to keep the UI clean
export const Icon = {
  ChevronLeft: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  ArrowRight: ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  ArrowDownRight: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="7" x2="17" y2="17" /><polyline points="17 7 17 17 7 17" transform="rotate(180 12 12)" />
    </svg>
  ),
  ArrowUpRight: ({ size = 12 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  ),
  Pulse: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
  Shield: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Users: ({ size = 18 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  Trash: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  ),
  Plus: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  Check: ({ size = 14 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
};

// --- BRAND ELEMENTS ---
export const BrandTriangle: React.FC<{ size?: number; color?: string }> = ({ size = 30, color = '#D04539' }) => (
  <svg width={size} height={size * 0.86} viewBox="0 0 100 86" fill="none">
    <path d="M50 4 L96 82 L4 82 Z" stroke={color} strokeWidth="9" strokeLinejoin="miter"/>
  </svg>
);

export const BrandBar: React.FC<BrandBarProps> = ({ user, onLogout, right }) => (
  <header className="brandbar">
    <div className="brandbar-inner">
      <div className="brand-mark flex items-center gap-3">
        <BrandTriangle size={32}/>
        <div className="brand-wordmark font-oswald uppercase text-xl">
          BARBARIAN <span className="text-[var(--red)]">PERFORMANCE</span>
        </div>
      </div>
      <div className="brandbar-right ml-auto flex items-center gap-4">
        {right}
        {user && <span className="pill text-xs font-mono uppercase border border-zinc-700 px-3 py-1 rounded-full">{user}</span>}
        {onLogout && (
          <button onClick={onLogout} className="text-xs font-bold uppercase opacity-60 hover:opacity-100 transition-opacity">
            SIGN OUT
          </button>
        )}
      </div>
    </div>
  </header>
);

export const SecHead: React.FC<SecHeadProps> = ({ title, meta }) => (
  <div className="sec-head flex items-center gap-4 my-8">
    <div className="accent-bar w-1 h-8 bg-[var(--red)]"/>
    <h2 className="font-oswald text-2xl uppercase italic leading-none">{title}</h2>
    {meta && <div className="meta ml-auto font-mono text-[10px] text-zinc-500 uppercase tracking-widest">{meta}</div>}
  </div>
);

export const Toast: React.FC<{ msg: string }> = ({ msg }) => {
  if (!msg) return null;
  return <div className="toast fixed bottom-24 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded border-l-4 border-[var(--red)] font-oswald text-sm z-[100]">
    ▣ {msg}
  </div>;
};

// --- FORMATTING HELPERS ---
export const fmtDelta = (d: number): string => {
  if (!d) return '0.00';
  const sign = d > 0 ? '+' : '';
  return sign + d.toFixed(2);
};
