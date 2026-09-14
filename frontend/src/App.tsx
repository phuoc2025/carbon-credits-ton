import React, { useState } from 'react';
import RecordCarbonModal from './components/RecordCarbonModal';

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ co2: 4000, credits: 4, points: 410 });
  const [checkedInToday, setCheckedInToday] = useState(true);
  const [isConnected, setIsConnected] = useState(true);

  const handleCheckIn = () => {
    if (!isConnected) {
      alert('⚠️ Vui lòng kết nối ví trước khi điểm danh!');
      return;
    }
    if (!checkedInToday) {
      setStats(prev => ({ ...prev, points: prev.points + 10 }));
      setCheckedInToday(true);
      alert('🎉 Điểm danh thành công! Bạn nhận được +10 SC Points.');
    } else {
      alert('⚠️ Bạn đã điểm danh hôm nay rồi!');
    }
  };

  const handleInvite = () => {
    if (!isConnected) {
      alert('⚠️ Vui lòng kết nối ví để nhận link giới thiệu!');
      return;
    }
    navigator.clipboard?.writeText?.("https://hnsm-carbon-rewards.vercel.app?ref=0QBB9HuE");
    setStats(prev => ({ ...prev, points: prev.points + 50 }));
    alert('🔗 Đã sao chép link giới thiệu! Bạn và người được mời vừa nhận thành công +50 SC Points.');
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h2>SCCe Rewards DApp</h2>
      
      {/* Wallet Connect / Disconnect Section */}
      <div style={{ marginBottom: '20px' }}>
        {isConnected ? (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 14px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
            <span>🟢 0QBB...9HuE</span>
            <button 
              onClick={() => setIsConnected(false)}
              style={{ background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', padding: '2px 8px', fontSize: '11px', cursor: 'pointer' }}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsConnected(true)}
            style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Connect Wallet (TON Connect)
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px', gap: '10px' }}>
        <div style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.co2} kg</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>CO2 Giảm Thiểu</div>
        </div>
        <div style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.credits}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>Carbon Credits</div>
        </div>
        <div style={{ border: '1px solid #cbd5e1', padding: '15px', borderRadius: '8px', flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{stats.points}</div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>SC Points</div>
        </div>
      </div>

      {/* Action Buttons Container */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', width: '250px' }}
        >
          🌱 Record Carbon
        </button>

        <button 
          onClick={handleCheckIn}
          style={{ backgroundColor: checkedInToday ? '#94a3b8' : '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: checkedInToday ? 'not-allowed' : 'pointer', width: '250px' }}
        >
          {checkedInToday ? '✅ Đã Điểm Danh Hôm Nay' : '📅 Điểm Danh Nhận SC Points'}
        </button>

        <button 
          onClick={handleInvite}
          style={{ backgroundColor: '#9333ea', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', width: '250px' }}
        >
          👥 Mời Bạn Bè (+50 SC Points)
        </button>
      </div>

      {/* Modal Chốt Sổ Cuối Ngày */}
      <RecordCarbonModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={(data) => {
          if (!isConnected) {
            alert('⚠️ Vui lòng kết nối ví TON Connect trước khi chốt sổ nhận thưởng!');
            return;
          }
          console.log("Đã gửi dữ liệu dMRV:", data);
          setStats(prev => ({
            ...prev,
            co2: prev.co2 + Math.round(data.totalKwh * 0.5),
            points: prev.points + Math.round(data.totalKwh * 0.2)
          }));
          setIsModalOpen(false);
          alert('✅ Chốt sổ thành công! Đã cộng điểm thưởng vào ví.');
        }} 
      />
    </div>
  );
}