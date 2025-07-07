// src/lib/stores/ticketStore.ts
import { writable } from 'svelte/store';

// Define types



export type Ticket = {
		_id: string;
		subject: string;
		customer: string;
		email: string;
		phone: string;
        priority: string;
        subcategory: string;
        
        userType: string;
         
        serviceType: string;
		date: string;
		status: string;
		category: string;
		description: string;
		messages: { sender: string; timestamp: string; content: string; isCustomer: boolean }[];
	}


export type SupportTickets = {
		_id: string;
		userType: string;
		category: string;
		subcategory: string;
		priority: string;
		status: string;
		subject: string;
		serviceType: string;
		assignedTo: { _id: string; email: string; role: string } | null;
		respondedAt: string | null;
		satisfactionRating: number | null;
		createdAt: string;
		updatedAt: string;
		ticketNumber: string;
		creator: { name: string; email: string; userType: string };
	}

// Define support categories and their associated questions


export type Message = {
  sender: string;
  senderId: string;
  message: string;
  attachments: { url: string; filename: string; mimetype: string; _id: string; uploadedAt: string }[];
  createdAt: string;
  readAt: string | null;
  _id: string;
};

export type Transaction = {
  id: string;
  type: string;
  amount: number;
  currency: string;
};

export type Attachment = {
  url: string;
  filename: string;
  mimetype: string;
  _id: string;
  uploadedAt: string;
};

export type Creator = {
  _id: string;
  name: string;
  email: string;
  userType: string;
  dataUnavailable?: boolean;
};

export type AssignedAdmin = {
  _id: string;
  email: string;
  role: string;
};

export type Metrics = {
  ageInHours: string;
  ageInDays: string;
  messageCount: number;
  attachmentCount: number;
};

export type Permissions = {
  canAssign: boolean;
  canReassign: boolean;
  canRespond: boolean;
  canResolve: boolean;
  canClose: boolean;
  canReopen: boolean;
  canEscalate: boolean;
  canViewDetails: boolean;
  isAssignedToMe: boolean;
};

export type Meta = {
  fetchedAt: string;
  viewedBy: string;
  dataIntegrity: {
    creatorFound: boolean;
    assignedAdminFound: boolean;
    relatedRideFound: boolean;
    relatedDeliveryFound: boolean;
  };
};

export type SupportTicket = {
  _id: string;
  userType: string;
  userId: string;
  category: string;
  subcategory: string;
  priority: string;
  status: string;
  subject: string;
  description: string;
  relatedRide: null | string;
  relatedDelivery: null | string;
  relatedTransaction: Transaction | null;
  serviceType: string;
  attachments: Attachment[];
  assignedTo: string | null;
  adminResponse: string | null;
  respondedBy: string | null;
  respondedAt: string | null;
  resolution: string | null;
  isEscalated: boolean;
  escalationReason: string | null;
  escalatedTo: string | null;
  tags: string[];
  refundIssued: boolean;
  refundAmount: number;
  satisfactionRating: number | null;
  feedbackComment: string | null;
  internalNotes: string | null;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  ticketNumber: string;
  isOverdue: boolean;
  urgencyLevel: string;
  estimatedResolution: number;
  creator: Creator;
  assignedAdmin: AssignedAdmin | null;
  transactionDetails: Transaction | null;
  metrics: Metrics;
  permissions: Permissions;
  meta: Meta;
};

export const tickets = writable<SupportTicket[]>([]);

export function getTicketById(id: string): SupportTicket | undefined {
  let ticket: SupportTicket | undefined;
  tickets.subscribe((allTickets) => {
    ticket = allTickets.find((t) => t._id === id);
  })();
  return ticket;
}

export function updateTicket(id: string, updatedTicket: Partial<SupportTicket>): void {
  tickets.update((allTickets) => {
    const index = allTickets.findIndex((ticket) => ticket._id === id);
    if (index !== -1) {
      allTickets[index] = { ...allTickets[index], ...updatedTicket };
    }
    return allTickets;
  });
}

export function addMessage(id: string, message: Message): void {
  tickets.update((allTickets) => {
    const index = allTickets.findIndex((ticket) => ticket._id === id);
    if (index !== -1) {
      allTickets[index].messages = [...allTickets[index].messages, message];
    }
    return allTickets;
  });
}