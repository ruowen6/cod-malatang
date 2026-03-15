import { useState, useEffect, useCallback, useRef } from 'react';
import { menuItems, type MenuItem } from '../data/menuItems';
import bgImage from '../assets/bg.PNG';
import './Scene1.css';

export interface SelectedItem {
  menuItem: MenuItem;
  uid: number;
  x: number;
  y: number;
  size: number; // badge diameter in px
}

interface Scene1Props {
  onCheckout: (items: SelectedItem[]) => void;
}

const MAX_ITEMS = 15;

export default function Scene1({ onCheckout }: Scene1Props) {
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const uidRef = useRef(0);

  // Pre-generate a shuffled grid of well-distributed positions (5 rows × 3 cols = 15 slots)
  const slotsRef = useRef<{ x: number; y: number }[]>([]);
  const slotIndexRef = useRef(0);

  if (slotsRef.current.length === 0) {
    const cols = 3;
    const rows = 5;
    const positions: { x: number; y: number }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Base grid: x 15%–85%, y 3%–38%
        const baseX = 15 + (c / (cols - 1)) * 70;
        const baseY = 3 + (r / (rows - 1)) * 35;
        // Add jitter: ±8% x, ±3% y
        const jitterX = (Math.random() - 0.5) * 16;
        const jitterY = (Math.random() - 0.5) * 6;
        positions.push({
          x: Math.max(12, Math.min(88, baseX + jitterX)),
          y: Math.max(2, Math.min(40, baseY + jitterY)),
        });
      }
    }
    // Fisher-Yates shuffle
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
    slotsRef.current = positions;
  }

  const handleRemove = useCallback((uid: number) => {
    setSelected(prev => prev.filter(item => item.uid !== uid));
  }, []);

  const handleSelect = useCallback((item: MenuItem) => {
    setSelected(prev => {
      if (prev.length >= MAX_ITEMS) return prev;
      const uid = ++uidRef.current;
      const slot = slotsRef.current[slotIndexRef.current % slotsRef.current.length];
      slotIndexRef.current++;
      // Random diameter between 55px and 100px
      const size = 55 + Math.random() * 45;
      return [...prev, { menuItem: item, uid, x: slot.x, y: slot.y, size }];
    });
  }, []);

  // DeviceOrientation for gravity effect
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      const gamma = e.gamma ?? 0; // left-right tilt: -90..90
      const beta = e.beta ?? 0;   // front-back tilt: -180..180
      setTilt({ x: gamma / 90, y: Math.max(-1, Math.min(1, beta / 90)) });
    };

    // Request permission on iOS 13+
    const requestPermission = async () => {
      const DOE = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof DOE.requestPermission === 'function') {
        const perm = await DOE.requestPermission();
        if (perm === 'granted') {
          window.addEventListener('deviceorientation', handler);
        }
      } else {
        window.addEventListener('deviceorientation', handler);
      }
    };

    requestPermission();
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  return (
    <div className="scene1" style={{ backgroundImage: `url(${bgImage})` }} onContextMenu={e => e.preventDefault()}>
      {/* NavBar */}
      <div className="navbar">
        <div className="navbar-left">
          <span className="navbar-title">菜单</span>
        </div>
        <div className="navbar-center">
          <span className="navbar-count">{selected.length}/{MAX_ITEMS}</span>
        </div>
        <div className="navbar-right">
          <button
            className="checkout-btn"
            onClick={() => onCheckout(selected)}
            disabled={selected.length === 0}
          >
            结账
          </button>
        </div>
      </div>

      {/* Menu grid */}
      <div className="menu-grid">
        {menuItems.map(item => (
          <button
            key={item.id}
            className="menu-item-btn"
            onClick={() => handleSelect(item)}
            disabled={selected.length >= MAX_ITEMS}
          >
            <img src={item.icon} alt={item.name} className="menu-item-icon" draggable={false} onContextMenu={e => e.preventDefault()} />
          </button>
        ))}
      </div>

      {/* Bowl area - lower 1/3 */}
      <div className="bowl-area">
        <div className="bowl">
          {selected.map(sel => {
            // Larger icons drift slower, smaller icons drift faster
            const tiltStrength = (80 / sel.size) * 30;
            return (
              <img
                key={sel.uid}
                src={sel.menuItem.bowlIcon}
                alt={sel.menuItem.name}
                className="badge"
                draggable={false}
                onContextMenu={e => e.preventDefault()}
                onClick={() => handleRemove(sel.uid)}
                style={{
                  width: sel.size,
                  height: sel.size,
                  left: `calc(${sel.x}% + ${tilt.x * tiltStrength}px)`,
                  top: `${sel.y}%`,
                  cursor: 'pointer',
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
