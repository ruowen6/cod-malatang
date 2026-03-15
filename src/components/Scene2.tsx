import { useState, useCallback } from 'react';
import type { SelectedItem } from './Scene1';
import { receiptTiles } from '../data/receiptTiles';
import qrCodeImg from '../assets/QR-code.JPG';
import './Scene2.css';

interface Scene2Props {
  items: SelectedItem[];
  onBack: () => void;
}

/** Build a tally map from selected items */
function tallyItems(items: SelectedItem[]) {
  const tally = new Map<number, { name: string; count: number }>();
  for (const sel of items) {
    const existing = tally.get(sel.menuItem.id);
    if (existing) {
      existing.count++;
    } else {
      tally.set(sel.menuItem.id, { name: sel.menuItem.name, count: 1 });
    }
  }
  return tally;
}

/** Load an image from a URL and return it as an HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/** Draw a receipt-style image onto a canvas and return its data URL */
async function generateReceiptImage(items: SelectedItem[]): Promise<string> {
  const tally = tallyItems(items);
  const entries = [...tally.values()];

  const WIDTH = 380;
  const PADDING = 24;
  const LINE_HEIGHT = 28;
  const FONT = '16px "Courier New", monospace';
  const TITLE_FONT = 'bold 22px "Courier New", monospace';

  // Calculate height
  const headerLines = 6;
  const footerLines = 6; // +1 for order number
  const contentHeight = entries.length * LINE_HEIGHT;
  const HEIGHT =
    PADDING * 2 +
    headerLines * LINE_HEIGHT +
    contentHeight +
    footerLines * LINE_HEIGHT +
    20;

  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d')!;

  // Background - default receipt paper color
  ctx.fillStyle = '#fefcf5';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Tile background images
  if (receiptTiles.length > 0) {
    // Load one tile to get its natural dimensions
    const sampleImg = await loadImage(receiptTiles[0]);
    const tileH = Math.round(sampleImg.naturalHeight * (WIDTH / sampleImg.naturalWidth));
    const slotCount = Math.ceil(HEIGHT / tileH);

    // Preload all unique tile images
    const loadedTiles = await Promise.all(receiptTiles.map(loadImage));

    // Decide which tile (or blank) goes in each slot.
    // Each slot is: a tile index, or -1 for blank.
    // At least one slot must be non-blank.
    const slots: number[] = [];
    for (let i = 0; i < slotCount; i++) {
      // ~50% chance of being blank, rest split among tiles
      if (Math.random() < 0.5) {
        slots.push(-1); // blank
      } else {
        slots.push(Math.floor(Math.random() * loadedTiles.length));
      }
    }
    // Guarantee at least one non-blank slot
    if (slots.every(s => s < 0)) {
      const idx = Math.floor(Math.random() * slotCount);
      slots[idx] = Math.floor(Math.random() * loadedTiles.length);
    }

    // Draw tiles
    for (let i = 0; i < slotCount; i++) {
      if (slots[i] >= 0) {
        const tileImg = loadedTiles[slots[i]];
        ctx.drawImage(tileImg, 0, i * tileH, WIDTH, tileH);
      }
      // blank slots keep the default paper color
    }
  }

  // Slight torn-edge effect at top
  ctx.strokeStyle = '#e0ddd5';
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.moveTo(0, 2);
  ctx.lineTo(WIDTH, 2);
  ctx.stroke();
  ctx.setLineDash([]);

  let y = PADDING + LINE_HEIGHT;
  const left = PADDING;
  const right = WIDTH - PADDING;

  ctx.fillStyle = '#222';
  ctx.textBaseline = 'middle';

  // Title
  ctx.font = TITLE_FONT;
  ctx.textAlign = 'center';
  ctx.fillText('麻 辣 烫 小 票', WIDTH / 2, y);
  y += LINE_HEIGHT + 4;

  // Store info
  ctx.font = '13px "Courier New", monospace';
  ctx.fillStyle = '#666';
  ctx.fillText('COD Malatang · 欢迎光临', WIDTH / 2, y);
  y += LINE_HEIGHT;

  // Dashed line
  ctx.strokeStyle = '#999';
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += LINE_HEIGHT * 0.7;

  // Column header
  ctx.font = FONT;
  ctx.fillStyle = '#444';
  ctx.textAlign = 'left';
  ctx.fillText('菜品', left, y);
  ctx.textAlign = 'right';
  ctx.fillText('数量', right, y);
  y += LINE_HEIGHT * 0.8;

  // Dashed line
  ctx.strokeStyle = '#bbb';
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += LINE_HEIGHT * 0.6;

  // Items
  ctx.fillStyle = '#222';
  for (const { name, count } of entries) {
    ctx.textAlign = 'left';
    ctx.fillText(name, left, y);
    ctx.textAlign = 'right';
    ctx.fillText(`× ${count}`, right, y);
    y += LINE_HEIGHT;
  }

  // Dashed line
  y += 4;
  ctx.strokeStyle = '#999';
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += LINE_HEIGHT;

  // Total
  ctx.font = 'bold 17px "Courier New", monospace';
  ctx.fillStyle = '#222';
  ctx.textAlign = 'left';
  ctx.fillText('合计', left, y);
  ctx.textAlign = 'right';
  ctx.fillText(`${items.length} 样`, right, y);
  y += LINE_HEIGHT + 4;

  // Dashed line
  ctx.strokeStyle = '#bbb';
  ctx.setLineDash([2, 2]);
  ctx.beginPath();
  ctx.moveTo(left, y);
  ctx.lineTo(right, y);
  ctx.stroke();
  ctx.setLineDash([]);
  y += LINE_HEIGHT;

  // Thank you
  ctx.font = '14px "Courier New", monospace';
  ctx.fillStyle = '#888';
  ctx.textAlign = 'center';
  ctx.fillText('谢谢惠顾 · 欢迎再来', WIDTH / 2, y);
  y += LINE_HEIGHT;

  // Date
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  ctx.fillText(dateStr, WIDTH / 2, y);
  y += LINE_HEIGHT;

  // Order number: timestamp + device-derived hash
  const ts = now.getTime();
  const ua = navigator.userAgent;
  let hash = 0;
  for (let i = 0; i < ua.length; i++) {
    hash = ((hash << 5) - hash + ua.charCodeAt(i)) | 0;
  }
  const orderNo = `${(ts % 100000000).toString().padStart(8, '0')}${Math.abs(hash % 10000).toString().padStart(4, '0')}`;
  ctx.font = '12px "Courier New", monospace';
  ctx.fillStyle = '#aaa';
  ctx.fillText(`订单编号: ${orderNo}`, WIDTH / 2, y);

  return canvas.toDataURL('image/png');
}

export default function Scene2({ items, onBack }: Scene2Props) {
  const [receiptSrc, setReceiptSrc] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);

  const tally = tallyItems(items);

  const handleConfirm = useCallback(async () => {
    const src = await generateReceiptImage(items);
    setReceiptSrc(src);
  }, [items]);

  return (
    <div className="scene2">
      <div className="receipt">
        <h1>🧾 小票</h1>
        <div className="receipt-line" />
        {items.length === 0 ? (
          <p className="empty">还没有选购任何菜品</p>
        ) : (
          <ul className="receipt-list">
            {[...tally.entries()].map(([id, { name, count }]) => (
              <li key={id}>
                <span className="item-name">{name}</span>
                <span className="item-count">× {count}</span>
              </li>
            ))}
          </ul>
        )}
        <div className="receipt-line" />
        <p className="total">共 {items.length} 样菜品</p>

        <div className="action-row">
          <button className="action-btn confirm-btn" onClick={handleConfirm}>
            确认
          </button>
          <button className="action-btn order-btn" onClick={() => setShowQR(true)}>
            去下单
          </button>
        </div>
        <button className="back-btn" onClick={onBack}>
          返回重选
        </button>
      </div>

      {/* Receipt image modal */}
      {receiptSrc && (
        <div className="modal-overlay" onClick={() => setReceiptSrc(null)}>
          <div className="modal-content receipt-modal" onClick={e => e.stopPropagation()}>
            <p className="modal-hint">长按图片可以保存</p>
            <div className="receipt-image-scroll">
              <img src={receiptSrc} alt="小票" className="receipt-image" />
            </div>
            <button className="modal-close" onClick={() => setReceiptSrc(null)}>
              关闭
            </button>
          </div>
        </div>
      )}

      {/* QR code modal */}
      {showQR && (
        <div className="modal-overlay" onClick={() => setShowQR(false)}>
          <div className="modal-content qr-modal" onClick={e => e.stopPropagation()}>
            <p className="qr-text">在这里可以找到我们的通贩哦！</p>
            <p className="qr-text">群号: 1077525788</p>
            <img src={qrCodeImg} alt="二维码" className="qr-image" />
            <button className="modal-close" onClick={() => setShowQR(false)}>
              关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
