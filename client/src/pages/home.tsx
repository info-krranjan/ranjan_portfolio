import { ThemeProvider } from "../components/ThemeProvider";
import { Navigation } from "../components/Navigation";
import { Hero } from "../components/Hero";
import { About } from "../components/About";
import { Projects } from "../components/Projects";
import { Contact } from "../components/Contact";
import { Resume } from "../components/Resume";
import { Footer } from "../components/Footer";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="min-h-screen">
        <Navigation />
        <main>
          <Hero />
          <About />
          <Projects />
          <Contact />
          <Resume />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
