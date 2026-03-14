import { useState, useEffect, useCallback, useRef } from 'react';
import { menuItems, type MenuItem } from '../data/menuItems';
import bgImage from '../assets/bg.PNG';
import './Scene1.css';

export interface SelectedItem {
  menuItem: MenuItem;
  uid: number;
  x: number;
  y: number;
}

interface Scene1Props {
  onCheckout: (items: SelectedItem[]) => void;
}

const MAX_ITEMS = 15;

export default function Scene1({ onCheckout }: Scene1Props) {
  const [selected, setSelected] = useState<SelectedItem[]>([]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const uidRef = useRef(0);

  const handleRemove = useCallback((uid: number) => {
    setSelected(prev => prev.filter(item => item.uid !== uid));
  }, []);

  const handleSelect = useCallback((item: MenuItem) => {
    setSelected(prev => {
      if (prev.length >= MAX_ITEMS) return prev;
      const uid = ++uidRef.current;
      // random position within bowl area (percentage based)
      const x = 20 + Math.random() * 60; // 20%–80% of bowl width
      const y = 5 + Math.random() * 35;  // 5%–40% of bowl height (well within visible top half)
      return [...prev, { menuItem: item, uid, x, y }];
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
    <div className="scene1" style={{ backgroundImage: `url(${bgImage})` }}>
      {/* Checkout button */}
      <button
        className="checkout-btn"
        onClick={() => onCheckout(selected)}
        disabled={selected.length === 0}
      >
        结账 ({selected.length}/{MAX_ITEMS})
      </button>

      {/* Menu grid - upper 2/3 */}
      <div className="menu-grid">
        {menuItems.map(item => (
          <button
            key={item.id}
            className="menu-item-btn"
            onClick={() => handleSelect(item)}
            disabled={selected.length >= MAX_ITEMS}
          >
            <img src={item.icon} alt={item.name} className="menu-item-icon" />
            <span className="menu-item-name">{item.name}</span>
          </button>
        ))}
      </div>

      {/* Bowl area - lower 1/3 */}
      <div className="bowl-area">
        <div className="bowl">
          {selected.map(sel => (
            <img
              key={sel.uid}
              src={sel.menuItem.bowlIcon}
              alt={sel.menuItem.name}
              className="badge"
              onClick={() => handleRemove(sel.uid)}
              style={{
                left: `calc(${sel.x}% + ${tilt.x * 30}px)`,
                top: `${sel.y}%`,
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
