"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/store/profileStore";
import WelcomeModal from "@/components/profile/WelcomeModal";

export default function ProfileProvider({ children }: { children: React.ReactNode }) {
    const { profile, isInitialized } = useProfileStore();
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        // Show welcome modal if no profile exists
        if (isInitialized && !profile) {
            setShowWelcome(true);
        }
    }, [isInitialized, profile]);

    return (
        <>
            {children}
            {showWelcome && (
                <WelcomeModal onComplete={() => setShowWelcome(false)} />
            )}
        </>
    );
}
