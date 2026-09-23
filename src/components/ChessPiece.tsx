import React from 'react';
import { PlayerColor } from '../types/chess';

interface ChessPieceProps {
  type: 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
  color: PlayerColor;
  isDragging?: boolean;
  isSelected?: boolean;
  className?: string;
}

export const ChessPiece: React.FC<ChessPieceProps> = ({
  type,
  color,
  isDragging = false,
  isSelected = false,
  className = '',
}) => {
  const isWhite = color === 'w';
  const pieceId = `${color}-${type}`;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center select-none transition-all duration-200 pointer-events-none ${
        isSelected ? 'scale-115 -translate-y-3' : ''
      } ${isDragging ? 'scale-125 -translate-y-4' : ''} ${className}`}
      style={{
        filter: isSelected
          ? 'drop-shadow(0 14px 12px rgba(0,0,0,0.75)) drop-shadow(0 0 14px rgba(251, 191, 36, 0.9))'
          : isDragging
          ? 'drop-shadow(0 20px 16px rgba(0,0,0,0.85))'
          : isWhite
          ? 'drop-shadow(0 5px 6px rgba(0,0,0,0.5)) drop-shadow(0 2px 3px rgba(0,0,0,0.35))'
          : 'drop-shadow(0 5px 7px rgba(0,0,0,0.9)) drop-shadow(0 1px 2px rgba(245, 158, 11, 0.25))',
      }}
    >
      <svg
        viewBox="0 0 50 56"
        className="w-[92%] h-[92%] transition-all"
        style={{
          transform: 'translateZ(14px)',
        }}
      >
        <defs>
          {/* Studio 3D Light - Cylindrical Wood Body Gradient (White Boxwood) */}
          <linearGradient id={`w-cyl-${pieceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c7ab82" />
            <stop offset="16%" stopColor="#f7eee2" />
            <stop offset="38%" stopColor="#ffffff" />
            <stop offset="68%" stopColor="#edd8be" />
            <stop offset="88%" stopColor="#caa97d" />
            <stop offset="100%" stopColor="#96744c" />
          </linearGradient>

          {/* Studio 3D Light - Spherical Head Gradient (White Boxwood) */}
          <radialGradient id={`w-sph-${pieceId}`} cx="36%" cy="32%" r="65%" fx="30%" fy="26%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="28%" stopColor="#faf2e5" />
            <stop offset="65%" stopColor="#e5d0b1" />
            <stop offset="88%" stopColor="#bf9f73" />
            <stop offset="100%" stopColor="#8c6841" />
          </radialGradient>

          {/* Studio 3D Light - Cylindrical Rosewood Body Gradient (Black Pieces) */}
          <linearGradient id={`b-cyl-${pieceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1410" />
            <stop offset="18%" stopColor="#5a493e" />
            <stop offset="36%" stopColor="#786354" />
            <stop offset="60%" stopColor="#43352c" />
            <stop offset="84%" stopColor="#221a15" />
            <stop offset="100%" stopColor="#0e0a08" />
          </linearGradient>

          {/* Studio 3D Light - Spherical Head Gradient (Black Pieces) */}
          <radialGradient id={`b-sph-${pieceId}`} cx="35%" cy="30%" r="68%" fx="28%" fy="24%">
            <stop offset="0%" stopColor="#876f5e" />
            <stop offset="25%" stopColor="#635144" />
            <stop offset="60%" stopColor="#352922" />
            <stop offset="85%" stopColor="#1a130f" />
            <stop offset="100%" stopColor="#090605" />
          </radialGradient>

          {/* High-Gloss Specular Glint Top-Left */}
          <linearGradient id={`glint-${pieceId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.3)" />
          </linearGradient>

          {/* Gold Rim Sheen on Black Piece Contours */}
          <linearGradient id={`gold-edge-${pieceId}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(245, 190, 110, 0.75)" />
            <stop offset="25%" stopColor="rgba(245, 190, 110, 0.2)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0.5)" />
          </linearGradient>

          {/* Horizontal Ring Torus Highlight */}
          <linearGradient id={`ring-top-${pieceId}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.7)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.5)" />
          </linearGradient>
        </defs>

        {render3DStauntonPiece(type, isWhite, pieceId)}
      </svg>
    </div>
  );
};

function render3DStauntonPiece(type: string, isWhite: boolean, id: string) {
  const cylFill = isWhite ? `url(#w-cyl-${id})` : `url(#b-cyl-${id})`;
  const sphFill = isWhite ? `url(#w-sph-${id})` : `url(#b-sph-${id})`;
  const stroke = isWhite ? '#6e5133' : '#140f0c';
  const strokeWidth = '1.3';
  const rimShine = isWhite ? 'rgba(255, 255, 255, 0.9)' : 'rgba(245, 190, 110, 0.65)';
  const deepShadow = isWhite ? '#785633' : '#0a0705';

  // Universal 3D Cylindrical Weighted Base for all Staunton pieces
  const render3DBase = () => (
    <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
      {/* Base contact rim shadow */}
      <ellipse cx="25" cy="50" rx="17" ry="4.2" fill={deepShadow} opacity="0.6" stroke="none" />
      {/* Lower cylindrical plinth */}
      <path d="M 8,47.5 C 8,51 42,51 42,47.5 L 41,44 C 41,41 9,41 9,44 Z" fill={cylFill} />
      {/* Plinth top rim light */}
      <ellipse cx="25" cy="44" rx="16" ry="3.5" fill={rimShine} opacity="0.4" stroke="none" />
      {/* Upper bell pedestal */}
      <path d="M 11,44 C 11,47 39,47 39,44 L 37,39 C 37,36.5 13,36.5 13,39 Z" fill={cylFill} />
      {/* Ring collar */}
      <ellipse cx="25" cy="39" rx="12" ry="2.8" fill={cylFill} />
      <ellipse cx="25" cy="38.5" rx="11" ry="2.2" fill={rimShine} opacity="0.5" stroke="none" />
    </g>
  );

  switch (type) {
    case 'p': // 3D Pawn
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Tapered conical body with cylindrical lighting */}
            <path d="M 17,38.5 C 18,33 20,27 20,24 L 30,24 C 30,27 32,33 33,38.5 Z" fill={cylFill} />
            {/* Specular sheen down the lit side of body */}
            <path d="M 21,37 C 21.5,32 23,27 23,24" stroke={rimShine} strokeWidth="1.4" fill="none" opacity="0.6" />
            {/* Double neck collar */}
            <ellipse cx="25" cy="24" rx="7.5" ry="2.2" fill={cylFill} />
            <ellipse cx="25" cy="23.5" rx="6.5" ry="1.6" fill={rimShine} opacity="0.5" stroke="none" />
            <ellipse cx="25" cy="21.5" rx="6.5" ry="1.8" fill={cylFill} />
            {/* True 3D Spherical Head */}
            <circle cx="25" cy="14" r="7.5" fill={sphFill} />
            {/* Specular Glint Hotspot */}
            <ellipse cx="22.5" cy="11.5" rx="2.5" ry="1.8" fill="#ffffff" opacity={isWhite ? '0.85' : '0.45'} stroke="none" />
          </g>
        </g>
      );

    case 'r': // 3D Rook (Architectural Castle Tower)
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Tower Shaft */}
            <path d="M 16,38.5 L 17.5,21 L 32.5,21 L 34,38.5 Z" fill={cylFill} />
            {/* Vertical Fluted Masonry Shading */}
            <path d="M 21,37 L 22,21" stroke={rimShine} strokeWidth="1.2" fill="none" opacity="0.5" />
            <path d="M 28,37 L 28,21" stroke={deepShadow} strokeWidth="1.2" fill="none" opacity="0.4" />
            {/* Parapet Molded Rim */}
            <ellipse cx="25" cy="21" rx="9" ry="2.5" fill={cylFill} />
            <path d="M 15,21 C 15,23.5 35,23.5 35,21 L 36,17.5 C 36,15 14,15 14,17.5 Z" fill={cylFill} />
            {/* Battlement Cavity Floor (recessed depth) */}
            <ellipse cx="25" cy="16.5" rx="9.5" ry="2.6" fill={deepShadow} opacity="0.75" />
            {/* 3D Battlements / Crenels with illuminated faces */}
            {/* Left Crenel */}
            <path d="M 14.5,17.5 L 14.5,11.5 L 19,11.5 L 19,16 Z" fill={cylFill} />
            <path d="M 15.5,12 L 18,12" stroke={rimShine} strokeWidth="1" fill="none" />
            {/* Center Crenel */}
            <path d="M 22.5,16.5 L 22.5,11 L 27.5,11 L 27.5,16.5 Z" fill={cylFill} />
            <path d="M 23.5,11.5 L 26.5,11.5" stroke={rimShine} strokeWidth="1" fill="none" />
            {/* Right Crenel */}
            <path d="M 31,16 L 31,11.5 L 35.5,11.5 L 35.5,17.5 Z" fill={cylFill} />
          </g>
        </g>
      );

    case 'n': // 3D Knight (Majestic Sculpted Stallion)
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Heavy Arched 3D Horse Neck & Head */}
            <path
              d="M 15,38.5 C 15,34 13.5,30 11,26.5 C 8.5,23 9,18.5 11,15 C 13,11.5 16,9.5 19,9.5 C 20.5,9.5 21,7.5 23,6.5 C 25,6 27,6.5 28.5,8 C 29,9 28,10.5 27,11.5 C 30,11.5 33,13.5 35,17 C 37,20.5 36.5,26 35,30 C 34,33 34,36 36,38.5 Z"
              fill={cylFill}
            />
            {/* Mane Creases with Lit Edges */}
            <path d="M 27,9 C 31,11.5 31,15.5 29,18" stroke={rimShine} strokeWidth="1.3" fill="none" />
            <path d="M 31.5,14.5 C 34.5,17.5 34,22 31,24" stroke={rimShine} strokeWidth="1.3" fill="none" />
            <path d="M 33,20 C 36,23 35.5,27.5 32,29.5" stroke={rimShine} strokeWidth="1.3" fill="none" />
            {/* 3D Stallion Ear with Shadowed Core */}
            <path d="M 22.5,6.5 L 25.5,12" stroke={stroke} strokeWidth="1.3" fill={cylFill} />
            <path d="M 23.5,8 L 24.5,11" stroke={rimShine} strokeWidth="1" />
            {/* Brow Ridge & Cheeks */}
            <path d="M 17,13 C 19,13 22,14.5 23,17" stroke={deepShadow} strokeWidth="1.2" fill="none" opacity="0.6" />
            {/* 3D Expressive Amber/Obsidian Eye */}
            <ellipse cx="16.5" cy="15" rx="1.8" ry="1.4" fill={isWhite ? '#3d2817' : '#f59e0b'} stroke="none" />
            <circle cx="16" cy="14.5" r="0.6" fill="#ffffff" stroke="none" />
            {/* Carved Nostril Flange */}
            <circle cx="12" cy="20.5" r="1.1" fill={deepShadow} stroke="none" opacity="0.8" />
            {/* Sculpted Jaw & Muzzle */}
            <path d="M 13.5,23 C 16,22.5 17.5,24 19,25.5" stroke={deepShadow} strokeWidth="1.2" fill="none" opacity="0.7" />
            <path d="M 19,25.5 C 22,23.5 25,24 27.5,27.5" stroke={rimShine} strokeWidth="1.2" fill="none" opacity="0.6" />
          </g>
        </g>
      );

    case 'b': // 3D Bishop (Sculpted Ellipsoid Mitre)
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Lathe-turned Tapered Stem */}
            <path d="M 17,38.5 C 18,32 19,27 20,24 L 30,24 C 31,27 32,32 33,38.5 Z" fill={cylFill} />
            {/* Annular Collar */}
            <ellipse cx="25" cy="24" rx="8" ry="2.4" fill={cylFill} />
            <ellipse cx="25" cy="23.5" rx="7" ry="1.8" fill={rimShine} opacity="0.5" stroke="none" />
            {/* 3D Ellipsoidal Mitre Head */}
            <path
              d="M 18,24 C 15,20 15,14 18,10.5 C 21,7 29,7 32,10.5 C 35,14 35,20 32,24 Z"
              fill={sphFill}
            />
            {/* Deep Angled Carved Mitre Cleft (Shadowed interior) */}
            <path d="M 23,11.5 L 30,17.5 L 27.5,19.5 L 21.5,13.5 Z" fill={deepShadow} opacity="0.85" stroke="none" />
            <path d="M 23,11.5 L 30,17.5" stroke={rimShine} strokeWidth="1.2" />
            {/* Mitre Center Rib */}
            <path d="M 25,18 L 25,24" stroke={deepShadow} strokeWidth="1.2" opacity="0.5" />
            {/* Finial Cross Ball at Peak */}
            <circle cx="25" cy="6.5" r="2.4" fill={isWhite ? `url(#w-sph-${id})` : '#f59e0b'} />
            <circle cx="24.2" cy="5.8" r="0.7" fill="#ffffff" opacity="0.7" stroke="none" />
          </g>
        </g>
      );

    case 'q': // 3D Queen (Flaring 5-Point Regal Coronet)
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Lathe-turned Royal Corset Body */}
            <path d="M 16,38.5 C 18,32 18,27 17,23 L 33,23 C 32,27 32,32 34,38.5 Z" fill={cylFill} />
            {/* Waist Belt with Gold Accent */}
            <ellipse cx="25" cy="30" rx="9" ry="2.2" fill={deepShadow} opacity="0.3" stroke="none" />
            <path d="M 17,30 C 21,31.5 29,31.5 33,30" stroke={rimShine} strokeWidth="1.3" fill="none" opacity="0.7" />
            {/* Coronet Ring Rim */}
            <ellipse cx="25" cy="23" rx="10" ry="2.6" fill={cylFill} />
            <ellipse cx="25" cy="22.5" rx="9" ry="2" fill={rimShine} opacity="0.4" stroke="none" />
            {/* Flaring Royal Crown Body */}
            <path d="M 14,23 L 11,14 L 17,19 L 25,11 L 33,19 L 39,14 L 36,23 Z" fill={cylFill} />
            {/* Crown Point Pearl Jewels (3D spherical pearls) */}
            <circle cx="11" cy="13" r="2" fill={isWhite ? '#ffffff' : '#f59e0b'} />
            <circle cx="17" cy="18" r="1.8" fill={isWhite ? '#ffffff' : '#f59e0b'} />
            <circle cx="25" cy="10" r="2.4" fill={isWhite ? '#ffffff' : '#f59e0b'} />
            <circle cx="33" cy="18" r="1.8" fill={isWhite ? '#ffffff' : '#f59e0b'} />
            <circle cx="39" cy="13" r="2" fill={isWhite ? '#ffffff' : '#f59e0b'} />
            {/* Pearl Glints */}
            <circle cx="24.3" cy="9.2" r="0.7" fill="#ffffff" stroke="none" />
          </g>
        </g>
      );

    case 'k': // 3D King (Imperial Crown with Upright Cross)
      return (
        <g>
          {render3DBase()}
          <g stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" strokeLinecap="round">
            {/* Sovereign Body Stem */}
            <path d="M 16,38.5 C 18,32 18,27 16.5,23 L 33.5,23 C 32,27 32,32 34,38.5 Z" fill={cylFill} />
            {/* Royal Belt */}
            <path d="M 17,31 C 21,32.5 29,32.5 33,31" stroke={rimShine} strokeWidth="1.3" fill="none" opacity="0.6" />
            {/* Coronet Ring */}
            <ellipse cx="25" cy="23" rx="10" ry="2.6" fill={cylFill} />
            {/* Imperial Crown Arched Cap */}
            <path
              d="M 15,23 C 14,18 17,14 25,14 C 33,14 36,18 35,23 Z"
              fill={sphFill}
            />
            {/* Crown Rib Highlights */}
            <path d="M 25,14 L 25,23" stroke={rimShine} strokeWidth="1.4" opacity="0.6" />
            <path d="M 17,21 C 21,22.5 29,22.5 33,21" stroke={rimShine} strokeWidth="1.2" fill="none" opacity="0.5" />
            {/* Sovereign Upright 3D Cross on Peak */}
            <g stroke={stroke} strokeWidth="1.6" fill={isWhite ? '#ffffff' : '#f59e0b'}>
              {/* Vertical Cross Stave */}
              <path d="M 23.5,14 L 23.5,4.5 L 26.5,4.5 L 26.5,14 Z" />
              {/* Horizontal Crossbeam */}
              <path d="M 20.5,7.5 L 29.5,7.5 L 29.5,10.5 L 20.5,10.5 Z" />
            </g>
            {/* Cross Glint */}
            <rect x="24" y="5" width="1" height="5" fill="#ffffff" opacity="0.8" stroke="none" />
            <rect x="21" y="8" width="8" height="1" fill="#ffffff" opacity="0.8" stroke="none" />
          </g>
        </g>
      );

    default:
      return null;
  }
}
