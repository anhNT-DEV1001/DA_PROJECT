import { createRoot } from "react-dom/client"

import "./index.css"
import { QueryProvider, RouteProvider, ThemeProvider } from "@/common/providers"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import { Toaster } from "./components/ui/toast.tsx"

createRoot(document.getElementById("root")!).render(
  <QueryProvider>
    <ThemeProvider>
      <TooltipProvider>
        <RouteProvider />
        <Toaster timeout={4_000} />
      </TooltipProvider>
    </ThemeProvider>
  </QueryProvider>
)
