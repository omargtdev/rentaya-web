import { Property } from '../models/property.model';
import { Visit } from '../models/visit.model';
import { Conversation, ChatMessage } from '../models/message.model';

/**
 * Datos semilla (mock) para HU03-HU10.
 * TODO(API): eliminar este archivo por completo cuando los datos
 * provengan de PostgreSQL vía los endpoints REST del backend.
 */
export const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    ownerId: 2,
    ownerName: 'Emir Sánchez',
    title: 'Departamento amoblado en Miraflores',
    district: 'Miraflores',
    address: 'Av. Principal 123',
    price: 2500,
    rooms: 2,
    bathrooms: 1,
    area: 70,
    description: 'Propiedad disponible, bien ubicada, con servicios cercanos y contacto directo con el propietario.',
    photos: [
      'https://picsum.photos/seed/rentaya1/800/600',
      'https://picsum.photos/seed/rentaya1b/800/600',
      'https://picsum.photos/seed/rentaya1c/800/600'
    ],
    status: 'Disponible',
    createdAt: '2026-06-01'
  },
  {
    id: 2,
    ownerId: 2,
    ownerName: 'Emir Sánchez',
    title: 'Mini depa en Surco',
    district: 'Surco',
    address: 'Jr. Las Begonias 456',
    price: 1800,
    rooms: 2,
    bathrooms: 1,
    area: 45,
    description: 'Mini departamento ideal para una o dos personas, cerca al parque y a centros comerciales.',
    photos: ['https://picsum.photos/seed/rentaya2/800/600'],
    status: 'Disponible',
    createdAt: '2026-06-03'
  },
  {
    id: 3,
    ownerId: 1,
    ownerName: 'Omar Gutierrez',
    title: 'Casa en San Borja',
    district: 'San Borja',
    address: 'Calle Los Sauces 789',
    price: 3200,
    rooms: 3,
    bathrooms: 2,
    area: 120,
    description: 'Casa amplia de dos pisos, con cochera y jardín, en zona residencial tranquila.',
    photos: ['https://picsum.photos/seed/rentaya3/800/600'],
    status: 'Disponible',
    createdAt: '2026-06-05'
  },
  {
    id: 4,
    ownerId: 1,
    ownerName: 'Omar Gutierrez',
    title: 'Dúplex en Lince',
    district: 'Lince',
    address: 'Av. Arequipa 2100',
    price: 2100,
    rooms: 2,
    bathrooms: 1,
    area: 65,
    description: 'Dúplex moderno remodelado, a dos cuadras de la avenida principal.',
    photos: ['https://picsum.photos/seed/rentaya4/800/600'],
    status: 'Disponible',
    createdAt: '2026-06-06'
  },
  {
    id: 5,
    ownerId: 2,
    ownerName: 'Emir Sánchez',
    title: 'Flat en Jesús María',
    district: 'Jesús María',
    address: 'Jr. Cuba 340',
    price: 1950,
    rooms: 2,
    bathrooms: 1,
    area: 55,
    description: 'Flat luminoso, edificio con ascensor y seguridad las 24 horas.',
    photos: ['https://picsum.photos/seed/rentaya5/800/600'],
    status: 'Disponible',
    createdAt: '2026-06-07'
  },
  {
    id: 6,
    ownerId: 1,
    ownerName: 'Omar Gutierrez',
    title: 'Estudio en Barranco',
    district: 'Barranco',
    address: 'Av. San Martín 88',
    price: 1600,
    rooms: 1,
    bathrooms: 1,
    area: 35,
    description: 'Estudio bohemio a pocos pasos del malecón, ideal para estudiantes o jóvenes profesionales.',
    photos: ['https://picsum.photos/seed/rentaya6/800/600'],
    status: 'Disponible',
    createdAt: '2026-06-08'
  }
];

export const MOCK_VISITS: Visit[] = [
  {
    id: 1,
    propertyId: 1,
    propertyTitle: 'Departamento en Miraflores',
    tenantId: 10,
    tenantName: 'Ana López',
    ownerId: 2,
    date: '2026-07-01',
    time: '10:00',
    status: 'Pendiente',
    createdAt: '2026-06-20'
  },
  {
    id: 2,
    propertyId: 2,
    propertyTitle: 'Mini depa en Surco',
    tenantId: 11,
    tenantName: 'Luis Pérez',
    ownerId: 2,
    date: '2026-07-02',
    time: '15:00',
    status: 'Pendiente',
    createdAt: '2026-06-21'
  },
  {
    id: 3,
    propertyId: 3,
    propertyTitle: 'Casa en San Borja',
    tenantId: 12,
    tenantName: 'Carla Ruiz',
    ownerId: 1,
    date: '2026-07-03',
    time: '09:00',
    status: 'Pendiente',
    createdAt: '2026-06-22'
  },
  {
    id: 4,
    propertyId: 5,
    propertyTitle: 'Flat en Jesús María',
    tenantId: 10,
    tenantName: 'Ana López',
    ownerId: 2,
    date: '2026-06-15',
    time: '11:00',
    status: 'Aceptada',
    createdAt: '2026-06-10'
  },
  {
    id: 5,
    propertyId: 1,
    propertyTitle: 'Departamento en Miraflores',
    tenantId: 13,
    tenantName: 'Jorge Díaz',
    ownerId: 2,
    date: '2026-06-12',
    time: '17:00',
    status: 'Rechazada',
    createdAt: '2026-06-09'
  }
];

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    propertyId: 1,
    propertyTitle: 'Departamento amoblado en Miraflores',
    ownerId: 2,
    ownerName: 'Emir Sánchez',
    tenantId: 10,
    tenantName: 'Ana López',
    lastMessage: 'Perfecto, ¿incluye mantenimiento?',
    lastMessageAt: '2026-06-25T10:15:00'
  },
  {
    id: 'c2',
    propertyId: 3,
    propertyTitle: 'Casa en San Borja',
    ownerId: 1,
    ownerName: 'Omar Gutierrez',
    tenantId: 10,
    tenantName: 'Ana López',
    lastMessage: 'Claro, quedamos en contacto.',
    lastMessageAt: '2026-06-24T18:40:00'
  }
];

export const MOCK_MESSAGES: ChatMessage[] = [
  {
    id: 1,
    conversationId: 'c1',
    senderId: 10,
    senderName: 'Ana López',
    content: 'Hola, ¿la propiedad sigue disponible?',
    sentAt: '2026-06-25T10:10:00'
  },
  {
    id: 2,
    conversationId: 'c1',
    senderId: 2,
    senderName: 'Emir Sánchez',
    content: 'Sí, está disponible. Puedes agendar una visita desde el botón de la publicación.',
    sentAt: '2026-06-25T10:12:00'
  },
  {
    id: 3,
    conversationId: 'c1',
    senderId: 10,
    senderName: 'Ana López',
    content: 'Perfecto, ¿incluye mantenimiento?',
    sentAt: '2026-06-25T10:15:00'
  },
  {
    id: 4,
    conversationId: 'c2',
    senderId: 1,
    senderName: 'Omar Gutierrez',
    content: 'Buenas tardes, quedo atento a tus consultas sobre la casa.',
    sentAt: '2026-06-24T18:35:00'
  },
  {
    id: 5,
    conversationId: 'c2',
    senderId: 10,
    senderName: 'Ana López',
    content: 'Claro, quedamos en contacto.',
    sentAt: '2026-06-24T18:40:00'
  }
];

export const DISTRICTS = [
  'Miraflores', 'Surco', 'San Borja', 'Lince', 'Jesús María', 'Barranco'
];
