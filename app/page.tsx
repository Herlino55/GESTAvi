"use client";

import { UiProvider } from "@/stores/ui";
import LandingPage from "./landingPage/page";
import { LoaderOverlay } from "@/middlewares/ui/loaderOverlay";
import { ToastNotification } from "@/middlewares/ui/toastNotification";

export default function Page() {
    return <LandingPage />;
}