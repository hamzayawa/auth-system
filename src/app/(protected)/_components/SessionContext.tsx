"use client";
import { createContext, useContext } from "react";

interface SessionContextType {
	session: any;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({
	session,
	children,
}: {
	session: any;
	children: React.ReactNode;
}) {
	return (
		<SessionContext.Provider value={{ session }}>
			{children}
		</SessionContext.Provider>
	);
}

export function useSession() {
	const ctx = useContext(SessionContext);
	if (!ctx) throw new Error("useSession must be inside SessionProvider");
	return ctx.session;
}
