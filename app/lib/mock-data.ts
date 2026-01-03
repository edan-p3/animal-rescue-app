import { Case, User } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: "user-1",
    name: "Maria Rodriguez",
    email: "maria@example.com",
    role: "rescuer",
    avatar_url: "https://i.pravatar.cc/150?u=maria",
  },
  {
    id: "user-2",
    name: "Dr. Chen",
    email: "chen@example.com",
    role: "vet",
    avatar_url: "https://i.pravatar.cc/150?u=chen",
  }
];

export const MOCK_CASES: Case[] = [
  {
    id: "case-101",
    species: "Dog",
    description: "Brown labrador mix found wandering near the highway. Looks malnourished but friendly.",
    status: "at_vet",
    urgency: "high",
    location_found: "Highway 101, Exit 24",
    location_current: "Dr. Chen's Clinic",
    date_rescued: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    primary_owner: MOCK_USERS[0],
    collaborators: [MOCK_USERS[1]],
    photos: [
      { id: "p1", url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=1000", thumbnail_url: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400" }
    ],
    activity_log: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
  },
  {
    id: "case-102",
    species: "Cat",
    description: "Tabby cat with injured leg. Hiding under a car.",
    status: "reported",
    urgency: "medium",
    location_found: "Maple Street & 5th",
    location_current: "Maple Street & 5th",
    date_rescued: "",
    primary_owner: MOCK_USERS[0],
    collaborators: [],
    photos: [
       { id: "p2", url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1000", thumbnail_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" }
    ],
    activity_log: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
  },
  {
    id: "case-103",
    species: "Bird",
    description: "Pigeon with broken wing.",
    status: "rescued",
    urgency: "low",
    location_found: "Central Park",
    location_current: "Rescuer Home",
    date_rescued: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    primary_owner: MOCK_USERS[0],
    collaborators: [],
    photos: [],
    activity_log: [],
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
  }
];

