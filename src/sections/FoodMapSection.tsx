import { useState, useRef, useEffect } from 'react';
import { useEditableData } from '../context/EditableDataContext';
import { usePage } from '../context/PageContext';
import { latLngToXY, xyToLatLng } from '../data/siteData';
import type { FoodSpot } from '../data/siteData';

// City coordinates calibrated to the real China map image (percentage x,y)
const CITY_COORDS: Record<string, { x: number; y: number }> = {
  // Major cities — calibrated to real map proportions
  '北京': { x: 71, y: 31 }, '上海': { x: 80, y: 47 }, '广州': { x: 68, y: 65 },
  '深圳': { x: 70, y: 67 }, '成都': { x: 48, y: 50 }, '重庆': { x: 52, y: 52 },
  '西安': { x: 56, y: 42 }, '武汉': { x: 64, y: 48 }, '南京': { x: 76, y: 43 },
  '杭州': { x: 78, y: 47 }, '长沙': { x: 62, y: 56 }, '昆明': { x: 44, y: 62 },
  '贵阳': { x: 50, y: 58 }, '哈尔滨': { x: 84, y: 14 }, '沈阳': { x: 80, y: 24 },
  '郑州': { x: 64, y: 38 }, '济南': { x: 72, y: 34 }, '福州': { x: 76, y: 57 },
  '南宁': { x: 58, y: 68 }, '拉萨': { x: 30, y: 52 }, '乌鲁木齐': { x: 18, y: 18 },
  '兰州': { x: 44, y: 36 }, '太原': { x: 62, y: 32 }, '石家庄': { x: 68, y: 30 },
  '合肥': { x: 72, y: 44 }, '南昌': { x: 70, y: 54 }, '海口': { x: 62, y: 78 },
  '呼和浩特': { x: 58, y: 24 }, '银川': { x: 46, y: 32 }, '西宁': { x: 40, y: 38 },
  '台北': { x: 82, y: 55 }, '厦门': { x: 74, y: 61 }, '青岛': { x: 76, y: 36 },
  '大连': { x: 80, y: 28 }, '苏州': { x: 80, y: 45 }, '宁波': { x: 80, y: 49 },
  '天津': { x: 72, y: 30 }, '长春': { x: 82, y: 18 }, '佛山': { x: 66, y: 67 },
  '东莞': { x: 69, y: 66 }, '中山': { x: 68, y: 68 }, '珠海': { x: 67, y: 69 },
  '惠州': { x: 69, y: 65 }, '三亚': { x: 58, y: 82 }, '丽江': { x: 42, y: 58 },
  '大理': { x: 42, y: 60 }, '桂林': { x: 56, y: 64 }, '张家界': { x: 60, y: 54 },
  '凤凰': { x: 58, y: 55 }, '西塘': { x: 80, y: 46 }, '乌镇': { x: 79, y: 47 },
  '平遥': { x: 60, y: 34 }, '西双版纳': { x: 46, y: 72 },
  '自贡': { x: 50, y: 52 }, '宜宾': { x: 48, y: 54 }, '泸州': { x: 50, y: 54 },
};

function getCityLatLng(city: string): { lat: number; lng: number } | null {
  const coords = CITY_COORDS[city.trim()];
  if (!coords) return null;
  return xyToLatLng(coords.x, coords.y);
}

const RATING_STARS = [1, 2, 3, 4, 5];

function FoodForm({
  initialData, onSave, onCancel, draftLatLng,
}: {
  initialData?: Partial<FoodSpot>;
  onSave: (data: Omit<FoodSpot, 'id'>) => void;
  onCancel: () => void;
  draftLatLng?: { lat: number; lng: number } | null;
}) {
  const [name, setName] = useState(initialData?.name || '');
  const [province, setProvince] = useState(initialData?.province || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [intro, setIntro] = useState(initialData?.intro || '');
  const [rating, setRating] = useState(initialData?.rating || 5);
  const [lat, setLat] = useState(initialData?.lat ?? 31.23);
  const [lng, setLng] = useState(initialData?.lng ?? 121.47);
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0].slice(0, 7));

  const handleCityBlur = () => {
    const cityLatLng = getCityLatLng(city);
    if (cityLatLng) {
      setLat(Number(cityLatLng.lat.toFixed(2)));
      setLng(Number(cityLatLng.lng.toFixed(2)));
    }
  };

  const handleSave = () => {
    if (!name.trim() || !city.trim()) return;
    const { x, y } = latLngToXY(lat, lng);
    onSave({
      name: name.trim(),
      province: province.trim() || city.trim(),
      city: city.trim(),
      district: district.trim() || undefined,
      intro: intro.trim(),
      rating,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      x,
      y,
      date,
    });
  };

  const setLatFromString = (val: string) => { const n = Number.parseFloat(val); if (!Number.isNaN(n)) setLat(n); };
  const setLngFromString = (val: string) => { const n = Number.parseFloat(val); if (!Number.isNaN(n)) setLng(n); };

  useEffect(() => {
    if (draftLatLng) {
      setLat(Number(draftLatLng.lat.toFixed(4)));
      setLng(Number(draftLatLng.lng.toFixed(4)));
    }
  }, [draftLatLng]);

  return (
    <div style={{
      padding: 24, background: '#fff', border: '3px solid #000', borderRadius: 12,
      boxShadow: '8px 8px 0 rgba(0,0,0,0.15)', maxWidth: 420, width: '100%',
    }}>
      <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, margin: '0 0 16px' }}>
        {initialData ? '编辑美食' : '添加美食打卡'}
      </h4>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>店名 *</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="店名"
          style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>省份 *</label>
          <input value={province} onChange={(e) => setProvince(e.target.value)} placeholder="如：四川"
            style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>城市 *</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} onBlur={handleCityBlur} placeholder="如：成都"
            style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>区/县（直辖市填区，非直辖市填县/区）</label>
        <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="如：锦江区 / 双流县"
          style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>纬度</label>
          <input type="number" step="0.01" value={lat} onChange={(e) => setLatFromString(e.target.value)} placeholder="18 ~ 54"
            style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>经度</label>
          <input type="number" step="0.01" value={lng} onChange={(e) => setLngFromString(e.target.value)} placeholder="73 ~ 135"
            style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ marginBottom: 12, padding: 8, background: 'rgba(79,140,255,0.1)', borderRadius: 6, fontSize: 12, color: '#4F8CFF' }}>
        当前地图坐标：{latLngToXY(lat, lng).x.toFixed(1)}%, {latLngToXY(lat, lng).y.toFixed(1)}%
        <br />
        提示：可直接点击地图设置位置，或在输入框里微调经纬度。
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>简介（最多50字）</label>
        <textarea value={intro} onChange={(e) => setIntro(e.target.value.slice(0, 50))} placeholder="推荐菜品、用餐体验..." rows={2}
          style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box', resize: 'vertical' }} />
        <span style={{ fontSize: 11, color: '#999', float: 'right' }}>{intro.length}/50</span>
        <div style={{ clear: 'both' }} />
      </div>

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>评分</label>
        <div style={{ display: 'flex', gap: 6 }}>
          {RATING_STARS.map((s) => (
            <button key={s} onClick={() => setRating(s)}
              style={{
                width: 36, height: 36, borderRadius: '50%', border: `2px solid ${s <= rating ? '#000' : '#ccc'}`,
                background: s <= rating ? '#FFCE5C' : '#f5f5f5', cursor: 'pointer', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s',
              }}
            >
              {s <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 600, display: 'block', marginBottom: 4 }}>打卡时间</label>
        <input type="month" value={date} onChange={(e) => setDate(e.target.value)}
          style={{ width: '100%', padding: 10, border: '2px solid #000', borderRadius: 6, fontSize: 14, boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={handleSave} disabled={!name.trim() || !city.trim()}
          style={{ flex: 1, padding: '10px 16px', background: 'var(--memphis-primary)', color: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', opacity: name.trim() && city.trim() ? 1 : 0.5 }}>保存</button>
        <button onClick={onCancel}
          style={{ flex: 1, padding: '10px 16px', background: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>取消</button>
      </div>
    </div>
  );
}

export default function FoodMapSection() {
  const { data, isAdmin, addFoodSpot, updateFoodSpot, deleteFoodSpot } = useEditableData();
  const { setPage } = usePage();
  const sectionRef = useRef<HTMLElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedSpot, setSelectedSpot] = useState<FoodSpot | null>(null);
  const [editingSpot, setEditingSpot] = useState<FoodSpot | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [hoveredSpot, setHoveredSpot] = useState<string | null>(null);
  const [draftLatLng, setDraftLatLng] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); },
      { threshold: 0.1 }
    );
    const revealEls = sectionRef.current?.querySelectorAll('.scroll-reveal');
    revealEls?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSave = (spotData: Omit<FoodSpot, 'id'>) => {
    if (editingSpot) {
      updateFoodSpot(editingSpot.id, spotData);
      setEditingSpot(null);
      setSelectedSpot(null);
    } else {
      addFoodSpot(spotData);
      setShowAddForm(false);
    }
    setDraftLatLng(null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAdmin || (!showAddForm && !editingSpot)) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setDraftLatLng(xyToLatLng(x, y));
  };

  const isPickingPosition = isAdmin && (showAddForm || editingSpot);

  return (
    <section ref={sectionRef} style={{ position: 'relative', padding: '100px 24px 60px', maxWidth: 1100, margin: '0 auto', minHeight: '100vh' }}>
      {/* Header */}
      <div className="scroll-reveal" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
        <div>
          <button onClick={() => setPage('home')}
            style={{ padding: '6px 14px', background: '#fff', border: '2px solid #000', borderRadius: 6, fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 600, cursor: 'pointer', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6" /></svg>
            返回首页
          </button>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--memphis-yellow)', transform: 'rotate(-1deg)', textShadow: '3px 3px 0 #000', display: 'inline-block', marginBottom: 8 }}>
            美食地图
          </h2>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: '#666', lineHeight: 1.6 }}>
            记录每一座城市的味道，点击图钉查看详情
          </p>
        </div>
        {isAdmin && !showAddForm && (
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => setShowAddForm(true)}
              style={{ padding: '10px 20px', background: 'var(--memphis-yellow)', color: '#000', border: '2px solid #000', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, cursor: 'pointer', boxShadow: '3px 3px 0 #000', display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              添加打卡
            </button>
            {data.foodSpots.length > 0 && (
              <button onClick={() => { if (confirm(`确定清除全部 ${data.foodSpots.length} 个打卡？`)) { data.foodSpots.forEach((s) => deleteFoodSpot(s.id)); } }}
                style={{ padding: '10px 16px', background: '#fff', color: '#c00', border: '2px solid #c00', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                清除全部
              </button>
            )}
          </div>
        )}
      </div>

      {isPickingPosition && (
        <div style={{ marginBottom: 16, padding: '10px 14px', background: 'var(--memphis-teal)', color: '#fff', border: '2px solid #000', borderRadius: 8, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 13 }}>
          🖱️ 点击地图可快速设置位置
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdmin && showAddForm && (
        <div style={{ maxWidth: 420, marginBottom: 32 }}>
          <FoodForm onSave={handleSave} onCancel={() => { setShowAddForm(false); setDraftLatLng(null); }} draftLatLng={draftLatLng} />
        </div>
      )}
      {isAdmin && editingSpot && (
        <div style={{ maxWidth: 420, marginBottom: 32 }}>
          <FoodForm initialData={editingSpot} onSave={handleSave} onCancel={() => { setEditingSpot(null); setDraftLatLng(null); }} draftLatLng={draftLatLng} />
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        className="scroll-reveal"
        style={{
          position: 'relative', width: '100%', paddingBottom: '80%',
          background: 'rgba(79,140,255,0.05)', border: '3px solid #000', borderRadius: 16,
          overflow: 'hidden', boxShadow: '8px 8px 0 rgba(0,0,0,0.1)',
          cursor: isPickingPosition ? 'crosshair' : 'default',
        }}
        onClick={handleMapClick}
      >
        {/* China Map Background Image */}
        <div style={{ position: 'absolute', inset: '2%', width: '96%', height: '96%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img
            src="/china-map.png"
            alt=""
            title=""
            style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.9, pointerEvents: 'none', userSelect: 'none' }}
            draggable={false}
          />
        </div>

        {/* Subtle grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08, backgroundImage: 'linear-gradient(rgba(79,140,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(79,140,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        {/* Food spot pins */}
        {data.foodSpots.map((spot) => {
          const isHovered = hoveredSpot === spot.id;
          const isSelected = selectedSpot?.id === spot.id;
          return (
            <div
              key={spot.id}
              style={{
                position: 'absolute',
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                transform: `translate(-50%, -100%) scale(${isHovered || isSelected ? 1.3 : 1})`,
                transformOrigin: 'bottom center',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                zIndex: isHovered || isSelected ? 10 : 1,
                cursor: 'pointer',
              }}
              onMouseEnter={() => setHoveredSpot(spot.id)}
              onMouseLeave={() => setHoveredSpot(null)}
              onClick={(e) => { e.stopPropagation(); setSelectedSpot(spot); }}
            >
              {/* Pin head */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isSelected ? '#FF6B6B' : '#FFCE5C',
                border: '2.5px solid #000',
                boxShadow: '2px 2px 0 rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>
                {spot.rating >= 4 ? '★' : '📍'}
              </div>
              {/* Pin tail */}
              <div style={{
                width: 0, height: 0,
                borderLeft: '6px solid transparent',
                borderRight: '6px solid transparent',
                borderTop: `10px solid ${isSelected ? '#FF6B6B' : '#FFCE5C'}`,
                margin: '-2px auto 0',
                filter: 'drop-shadow(1px 1px 0 rgba(0,0,0,0.2))',
              }} />
              {/* Label on hover/select */}
              {(isHovered || isSelected) && (
                <div style={{
                  position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                  background: '#fff', border: '2px solid #000', borderRadius: 6,
                  padding: '4px 10px', whiteSpace: 'nowrap', marginBottom: 6,
                  fontFamily: 'var(--font-display)', fontSize: 12, fontWeight: 700,
                  boxShadow: '2px 2px 0 rgba(0,0,0,0.15)',
                }}>
                  {spot.name}
                  <div style={{
                    position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                    width: 0, height: 0,
                    borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
                    borderTop: '5px solid #000',
                  }} />
                </div>
              )}
            </div>
          );
        })}

        {/* Click empty area to deselect */}
        <div
          style={{ position: 'absolute', inset: 0, pointerEvents: isPickingPosition ? 'none' : 'auto' }}
          onClick={() => { if (!isPickingPosition) setSelectedSpot(null); }}
        />
      </div>

      {/* Selected spot detail panel */}
      {selectedSpot && (
        <div style={{
          marginTop: 24, padding: 24, background: '#fff', border: '3px solid #000',
          borderRadius: 12, boxShadow: '6px 6px 0 rgba(0,0,0,0.1)', position: 'relative',
        }}>
          <button onClick={() => setSelectedSpot(null)}
            style={{ position: 'absolute', top: 12, right: 12, width: 32, height: 32, borderRadius: '50%', border: '2px solid #000', background: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700 }}>
            ×
          </button>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: '#FFCE5C',
              border: '3px solid #000', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>
              ★
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 22, margin: '0 0 4px' }}>{selectedSpot.name}</h3>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 8 }}>
                <span style={{ padding: '3px 10px', background: 'rgba(79,140,255,0.15)', border: '1px solid #4F8CFF', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#4F8CFF' }}>{selectedSpot.city}</span>
                {selectedSpot.district && (
                  <span style={{ padding: '3px 10px', background: 'rgba(255,206,92,0.2)', border: '1px solid #FFCE5C', borderRadius: 4, fontSize: 12, fontWeight: 600, color: '#b38600' }}>{selectedSpot.district}</span>
                )}
                <span style={{ fontSize: 12, color: '#999' }}>{selectedSpot.province}</span>
                <span style={{ fontSize: 12, color: '#999' }}>{selectedSpot.date}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, marginBottom: 8 }}>
                {RATING_STARS.map((s) => (
                  <span key={s} style={{ fontSize: 18, color: s <= selectedSpot.rating ? '#FFCE5C' : '#ddd' }}>★</span>
                ))}
              </div>
              {selectedSpot.intro && (
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.7, color: '#444', margin: 0 }}>{selectedSpot.intro}</p>
              )}
              {isAdmin && (
                <div style={{ display: 'flex', gap: 8, marginTop: 16, paddingTop: 12, borderTop: '1px dashed rgba(0,0,0,0.2)' }}>
                  <button onClick={() => { setEditingSpot(selectedSpot); setShowAddForm(false); }}
                    style={{ padding: '6px 16px', background: 'rgba(255,255,255,0.7)', border: '2px solid #000', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer' }}>编辑</button>
                  <button onClick={() => { if (confirm('确定删除？')) { deleteFoodSpot(selectedSpot.id); setSelectedSpot(null); } }}
                    style={{ padding: '6px 16px', background: 'rgba(255,100,100,0.3)', border: '2px solid #000', borderRadius: 4, fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 600, cursor: 'pointer', color: '#c00' }}>删除</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Food spots list */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 20, marginBottom: 16 }}>
          已打卡 {data.foodSpots.length} 家
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
          {data.foodSpots.map((spot) => (
            <div
              key={spot.id}
              onClick={() => setSelectedSpot(spot)}
              style={{
                padding: 16, background: '#fff', border: '2px solid #000', borderRadius: 8,
                cursor: 'pointer', boxShadow: '3px 3px 0 rgba(0,0,0,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '5px 5px 0 rgba(0,0,0,0.15)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '3px 3px 0 rgba(0,0,0,0.08)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <h4 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, margin: 0 }}>{spot.name}</h4>
                <span style={{ fontSize: 14, color: '#FFCE5C' }}>{Array(spot.rating).fill('★').join('')}</span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 6, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 12, color: '#4F8CFF', fontWeight: 600 }}>{spot.city}</span>
                {spot.district && <span style={{ fontSize: 11, color: '#b38600', fontWeight: 600 }}>{spot.district}</span>}
                <span style={{ fontSize: 11, color: '#999' }}>{spot.date}</span>
              </div>
              {spot.intro && <p style={{ fontSize: 13, color: '#666', lineHeight: 1.5, margin: 0, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', textOverflow: 'ellipsis' }}>{spot.intro}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
