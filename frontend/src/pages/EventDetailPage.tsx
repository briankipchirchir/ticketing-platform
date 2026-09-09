import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventApi, ticketApi } from '../services/api';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    eventApi.getById(Number(id))
      .then(res => setEvent(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setBooking(true);
    setError('');
    setSuccess('');
    try {
      await ticketApi.book({ eventId: Number(id), quantity });
      setSuccess(`🎉 Successfully booked ${quantity} ticket(s)! Check your email for confirmation.`);
      // Refresh event to show updated ticket count
      const res = await eventApi.getById(Number(id));
      setEvent(res.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <div style={styles.loading}>Loading event...</div>;
  if (!event) return <div style={styles.loading}>Event not found.</div>;

  return (
    <div style={styles.container}>
      <nav style={styles.navbar}>
        <span style={styles.logo}>🎟️ Ticketing Platform</span>
        <button style={styles.navBtn} onClick={() => navigate('/events')}>← Back to Events</button>
      </nav>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <span style={styles.status}>{event.status}</span>
            <h1 style={styles.title}>{event.title}</h1>
            <p style={styles.description}>{event.description}</p>
          </div>

          <div style={styles.details}>
            <div style={styles.detailItem}>
              <span style={styles.detailIcon}>📍</span>
              <div>
                <p style={styles.detailLabel}>Venue</p>
                <p style={styles.detailValue}>{event.venue}</p>
              </div>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailIcon}>📅</span>
              <div>
                <p style={styles.detailLabel}>Date</p>
                <p style={styles.detailValue}>{new Date(event.eventDate).toLocaleDateString('en-KE', { dateStyle: 'full' })}</p>
              </div>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailIcon}>🎟️</span>
              <div>
                <p style={styles.detailLabel}>Available Tickets</p>
                <p style={styles.detailValue}>{event.availableTickets} / {event.totalTickets}</p>
              </div>
            </div>
            <div style={styles.detailItem}>
              <span style={styles.detailIcon}>💰</span>
              <div>
                <p style={styles.detailLabel}>Price per Ticket</p>
                <p style={styles.detailValue}>KES {event.ticketPrice.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {success && <div style={styles.success}>{success}</div>}
          {error && <div style={styles.error}>{error}</div>}

          {event.availableTickets > 0 && !success && (
            <div style={styles.bookingBox}>
              <h3 style={styles.bookingTitle}>Book Tickets</h3>
              <div style={styles.quantityRow}>
                <label style={styles.quantityLabel}>Number of tickets:</label>
                <div style={styles.quantityControls}>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.max(1, q - 1))}>−</button>
                  <span style={styles.qtyValue}>{quantity}</span>
                  <button style={styles.qtyBtn} onClick={() => setQuantity(q => Math.min(event.availableTickets, q + 1))}>+</button>
                </div>
              </div>
              <div style={styles.totalRow}>
                <span>Total:</span>
                <span style={styles.total}>KES {(event.ticketPrice * quantity).toLocaleString()}</span>
              </div>
              <button style={styles.bookBtn} onClick={handleBook} disabled={booking}>
                {booking ? 'Booking...' : `Book ${quantity} Ticket${quantity > 1 ? 's' : ''}`}
              </button>
            </div>
          )}

          {event.availableTickets === 0 && (
            <div style={styles.soldOut}>This event is sold out.</div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { minHeight: '100vh', background: '#f5f5f5' },
  loading: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '18px' },
  navbar: { background: '#4f46e5', padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { color: 'white', fontSize: '20px', fontWeight: 700 },
  navBtn: { padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 },
  content: { maxWidth: '700px', margin: '0 auto', padding: '32px 16px' },
  card: { background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTop: { marginBottom: '24px' },
  status: { background: '#dcfce7', color: '#16a34a', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 600 },
  title: { fontSize: '28px', margin: '12px 0 8px', fontWeight: 700 },
  description: { color: '#666', fontSize: '16px', lineHeight: '1.6' },
  details: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', padding: '24px', background: '#f9fafb', borderRadius: '8px' },
  detailItem: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  detailIcon: { fontSize: '20px' },
  detailLabel: { margin: 0, fontSize: '12px', color: '#888', fontWeight: 600, textTransform: 'uppercase' },
  detailValue: { margin: '4px 0 0', fontSize: '15px', fontWeight: 600 },
  success: { background: '#dcfce7', color: '#16a34a', padding: '16px', borderRadius: '8px', marginBottom: '16px', fontWeight: 500 },
  error: { background: '#fee', color: '#c00', padding: '16px', borderRadius: '8px', marginBottom: '16px' },
  bookingBox: { border: '2px solid #4f46e5', borderRadius: '12px', padding: '24px' },
  bookingTitle: { margin: '0 0 16px', fontSize: '18px', fontWeight: 700 },
  quantityRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' },
  quantityLabel: { fontWeight: 500 },
  quantityControls: { display: 'flex', alignItems: 'center', gap: '16px' },
  qtyBtn: { width: '32px', height: '32px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '18px', cursor: 'pointer' },
  qtyValue: { fontSize: '20px', fontWeight: 700, minWidth: '30px', textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '16px' },
  total: { fontWeight: 700, fontSize: '20px', color: '#4f46e5' },
  bookBtn: { width: '100%', padding: '14px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' },
  soldOut: { background: '#f3f4f6', color: '#6b7280', padding: '16px', borderRadius: '8px', textAlign: 'center', fontWeight: 500 },
};

export default EventDetailPage;
