import axios from 'axios';

const AUTH_URL = 'http://localhost:8081';
const EVENT_URL = 'http://localhost:8082';
const TICKET_URL = 'http://localhost:8083';

const getToken = () => localStorage.getItem('token');

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` }
});

// Auth API
export const authApi = {
  register: (data: { fullName: string; email: string; password: string }) =>
    axios.post(`${AUTH_URL}/api/auth/register`, data),

  login: (data: { email: string; password: string }) =>
    axios.post(`${AUTH_URL}/api/auth/login`, data),
};

// Events API
export const eventApi = {
  getAll: () => axios.get(`${EVENT_URL}/api/events`),

  getById: (id: number) => axios.get(`${EVENT_URL}/api/events/${id}`),

  create: (data: any) =>
    axios.post(`${EVENT_URL}/api/events`, data, authHeaders()),
};

// Tickets API
export const ticketApi = {
  book: (data: { eventId: number; quantity: number }) =>
    axios.post(`${TICKET_URL}/api/tickets/book`, data, authHeaders()),

  getMyTickets: () =>
    axios.get(`${TICKET_URL}/api/tickets/my-tickets`, authHeaders()),

  validate: (ticketCode: string) =>
    axios.post(`${TICKET_URL}/api/tickets/validate/${ticketCode}`, {}, authHeaders()),
};
