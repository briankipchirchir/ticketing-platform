export interface User {
  email: string;
  fullName: string;
  role: string;
  token: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  totalTickets: number;
  availableTickets: number;
  ticketPrice: number;
  organizerEmail: string;
  status: string;
}

export interface Ticket {
  id: number;
  ticketCode: string;
  eventId: number;
  userEmail: string;
  pricePaid: number;
  status: string;
  purchasedAt: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  fullName: string;
  role: string;
}
