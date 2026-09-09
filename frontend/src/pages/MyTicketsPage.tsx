import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ticketApi } from '../services/api';
import { Ticket } from '../types';
import { useAuth } from '../context/AuthContext';

const MyTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    ticketApi.getMyTickets()
      .then(res => setTickets(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#dcfce7', color: '#16a34a' };
      case 'USED': return { bg: '#e0e7ff', color: '#4338ca' };
      case 'CANCELLED': return { bg: '#fee2e2', color: '#dc2626' };
      default: return { bg: '#f3f4f6', color: '#6b7280' };
    }
  };

  if (loading) return <div style={styles.loading}>Loading tickets...</div>;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <span style={styles.logo}>🎟️ Ticketing Platform</span>
        <div style={styles.navRight}>
          {user && <span style={styles.welcome}>Hi, {user.fullName}</span>}
          <button style={styles.navBtn} onClick={() => navigate('/events')}>Browse Events</button>
          <button style={styles.navBtnOutline} onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div style={styles.content}>
        <h1 style={styles.heading}>My Tickets</h1>

        {tickets.length === 0 ? (
          <div style={styles.empty}>
            <p>You haven't booked any tickets yet.</p>
            <button style={styles.browseBtn} onClick={() => navigate('/events')}>
              Browse Events
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {tickets.map(ticket => {
              const statusStyle = getStatusColor(ticket.status);
              return (
                <div key={ticket.id} style={styles.card}>
                  <div style={styles.cardLeft}>
                    <div style={styles.ticketCode}>{ticket.ticketCode}</div>
                    <p style={styles.eventId}>Event #{ticket.eventId}</p>
                    <p style={styles.date}>
                      Booked: {new Date(ticket.purchasedAt).toLocaleDateString('en-KE', { dateStyle: 'medium' })}
                    </p>
                  </div>
                  <div style={styles.cardRight}>
                    <span style={{ ...styles.status, background: statusStyle.bg, color: statusStyle.color }}>
                      {ticket.status}
                    </span>
                    <p style={styles.price}>KES {ticket.pricePaid.toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '18px' },
  navbar: { background: '#4f46e5', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: '20px', fontWeight: 700 },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  welcome: { color: 'white', fontSize: '14px' },
  navBtn: { padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  navBtnOutline: { padding: '8px 16px', background: 'transparent', color: 'white', border: '1px solid white', borderRadius: '6px', cursor: 'pointer' },
  content: { maxWidth: '800px', margin: '0 auto', padding: '32px 16px' },
  heading: { fontSize: '28px', marginBottom: '24px' },
  empty: { textAlign: 'center', padding: '60px', background: 'white', borderRadius: '12px', color: '#666' },
  browseBtn: { marginTop: '16px', padding: '12px 24px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 },
  list: { display: 'flex', flexDirection: 'column', gap: '16px' },
  card: { background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  cardLeft: {},
  ticketCode: { fontSize: '20px', fontWeight: 700, fontFamily: 'monospace', color: '#4f46e5', marginBottom: '8px' },
  eventId: { margin: '0 0 4px', color: '#666', fontSize: '14px' },
  date: { margin: 0, color: '#888', fontSize: '13px' },
  cardRight: { textAlign: 'right' },
  status: { padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  price: { margin: '8px 0 0', fontSize: '18px', fontWeight: 700, color: '#4f46e5' },
};

export default MyTicketsPage;
