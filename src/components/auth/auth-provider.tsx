"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	type ReactNode,
} from "react";
import { authClient } from "@/lib/auth/auth-client";

// ------------------ Types ------------------
interface User {
	id: string;
	name: string | null;
	email: string;
	image?: string | null;
	roles?: string[];
	permissionObject?: Record<string, string[]>;
}

interface Session {
	user: User;
	expires?: string;
}

interface RolesResponse {
	roles?: string[];
	permissionObject?: Record<string, string[]>;
}

interface AuthContextType {
	client: typeof authClient;
	session: Session | null;
	isLoading: boolean;
	user: User | null;
	logout: () => Promise<void>;
}

// ------------------ Context ------------------
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [session, setSession] = useState<Session | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const sessionData = await authClient.getSession();

				// Correctly get user from sessionData
				const userData = (sessionData as any)?.user; // Cast temporarily to fix TS
				if (!userData) return;

				// Fetch roles from API
				try {
					const rolesResponse = await fetch("/api/auth/user-roles");
					if (!rolesResponse.ok)
						throw new Error(`HTTP ${rolesResponse.status}`);
					const rolesData: RolesResponse = await rolesResponse.json();

					const user: User = {
						id: userData.id,
						email: userData.email,
						name: userData.name || null,
						image: userData.image || null,
						roles: rolesData.roles || [],
						permissionObject: rolesData.permissionObject,
					};

					setSession({
						user,
						expires: (sessionData as any)?.expires, // Cast to any to fix TS
					});
				} catch (rolesError) {
					console.error("[AuthProvider] Failed to fetch roles:", rolesError);

					// Set minimal session if roles fetch fails
					const user: User = {
						id: userData.id,
						email: userData.email,
						name: userData.name || null,
						image: userData.image || null,
					};
					setSession({ user });
				}
			} catch (error) {
				console.error("[AuthProvider] Failed to fetch session:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchSession();
	}, []);

	const logout = async () => {
		await authClient.signOut();
		setSession(null);
	};

	return (
		<AuthContext.Provider
			value={{
				client: authClient,
				session,
				isLoading,
				user: session?.user || null,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

// ------------------ Hooks ------------------
export function useAuth() {
	const context = useContext(AuthContext);
	if (!context) throw new Error("useAuth must be used within AuthProvider");
	return context;
}

export function useAuthClient() {
	const context = useContext(AuthContext);
	if (!context)
		throw new Error("useAuthClient must be used within AuthProvider");
	return context.client;
}
