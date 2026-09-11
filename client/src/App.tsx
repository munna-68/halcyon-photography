/** Aperture Blue app routes: editorial calm, utility-forward bookings, responsive always. */
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router as WouterRouter } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Booking from "./pages/Booking";
import Galleries from "./pages/Galleries";
import About from "./pages/About";
import NotFound from "./pages/NotFound";

const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

function AppRoutes() {
  return <Switch><Route path="/" component={Home} /><Route path="/services" component={Services} /><Route path="/book" component={Booking} /><Route path="/galleries" component={Galleries} /><Route path="/about" component={About} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><WouterRouter base={routerBase}><AppRoutes /></WouterRouter></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
