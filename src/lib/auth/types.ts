export type Role = "client" | "moderator" | "admin" | "super_admin";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export type Session = {
  user: SessionUser;
  createdAt: string;
};

