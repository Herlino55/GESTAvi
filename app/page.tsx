"use client";

import { UiProvider } from "@/stores/ui";
import LandingPage from "./landingPage/page";
import { LoaderOverlay } from "@/middleware/ui/loaderOverlay";
import { ToastNotification } from "@/middleware/ui/toastNotification";

export default function Page() {
    return <LandingPage />;
}