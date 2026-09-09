import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventApi } from '../services/api';
import { Event } from '../types';
import { useAuth } from '../context/AuthContext';

const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    eventApi.getAll()
      .then(res => setEvents(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎟️</div>
        <p style={{ color: '#64748b', fontSize: '16px' }}>Loading events...</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Navbar */}
      <nav style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
        padding: '0 32px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 12px rgba(99,102,241,0.3)', position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🎟️</span>
          <span style={{ color: 'white', fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>
            TicketHub
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {user && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '14px'
              }}>
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px' }}>{user.fullName}</span>
            </div>
          )}
          <button onClick={() => navigate('/my-tickets')} style={{
            padding: '8px 16px', background: 'rgba(255,255,255,0.15)',
            color: 'white', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500
          }}>My Tickets</button>
          <button onClick={handleLogout} style={{
            padding: '8px 16px', background: 'white',
            color: '#4f46e5', border: 'none',
            borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 600
          }}>Logout</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 50%, #4338ca 100%)',
        padding: '64px 32px', textAlign: 'center', color: 'white'
      }}>
        <h1 style={{ fontSize: '42px', fontWeight: 800, marginBottom: '12px', letterSpacing: '-1px' }}>
          Discover Amazing Events
        </h1>
        <p style={{ fontSize: '18px', opacity: 0.85, maxWidth: '500px', margin: '0 auto' }}>
          Book tickets for the best events happening near you
        </p>
      </div>

      {/* Events Grid */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b' }}>
            Upcoming Events <span style={{ color: '#94a3b8', fontSize: '16px', fontWeight: 400 }}>({events.length})</span>
          </h2>
        </div>

        {events.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px', background: 'white', borderRadius: '16px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎭</div>
            <h3 style={{ color: '#334155', marginBottom: '8px' }}>No events yet</h3>
            <p style={{ color: '#94a3b8' }}>Check back soon for upcoming events</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
            {events.map(event => (
              <div key={event.id} style={{
                background: 'white', borderRadius: '16px',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                overflow: 'hidden', transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)';
                }}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                {/* Card color banner */}
                <div style={{
                  height: '8px',
                  background: 'linear-gradient(90deg, #6366f1, #8b5cf6)'
                }} />
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span style={{
                      background: '#dcfce7', color: '#16a34a',
                      padding: '4px 10px', borderRadius: '20px',
                      fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'
                    }}>{event.status}</span>
                    <span style={{ color: '#94a3b8', fontSize: '12px' }}>
                      {event.availableTickets} left
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', marginBottom: '8px', lineHeight: '1.3' }}>
                    {event.title}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '20px', lineHeight: '1.5' }}>
                    {event.description?.substring(0, 100)}{event.description?.length > 100 ? '...' : ''}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                      <span>📍</span><span>{event.venue}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
                      <span>📅</span>
                      <span>{new Date(event.eventDate).toLocaleDateString('en-KE', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{ background: '#f1f5f9', borderRadius: '4px', height: '6px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${(event.availableTickets / event.totalTickets) * 100}%`,
                        background: event.availableTickets < 50 ? '#ef4444' : '#10b981',
                        height: '100%', borderRadius: '4px', transition: 'width 0.3s'
                      }} />
                    </div>
                    <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                      {event.availableTickets} of {event.totalTickets} tickets available
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>FROM</p>
                      <p style={{ fontSize: '22px', fontWeight: 800, color: '#4f46e5' }}>
                        KES {event.ticketPrice.toLocaleString()}
                      </p>
                    </div>
                    <button
                      style={{
                        padding: '10px 20px',
                        background: event.availableTickets > 0
                          ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                          : '#e2e8f0',
                        color: event.availableTickets > 0 ? 'white' : '#94a3b8',
                        border: 'none', borderRadius: '10px',
                        cursor: event.availableTickets > 0 ? 'pointer' : 'not-allowed',
                        fontWeight: 600, fontSize: '14px'
                      }}
                      disabled={event.availableTickets === 0}
                    >
                      {event.availableTickets > 0 ? 'Book Now →' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
