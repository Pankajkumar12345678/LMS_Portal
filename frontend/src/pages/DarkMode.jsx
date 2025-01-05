import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

const DarkMode = () => {
  const { theme, setTheme } = useTheme(); // Get the current theme and setTheme function

  // Handle toggling between light and dark modes
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark"); // Switch to dark mode
    } else {
      setTheme("light"); // Switch to light mode
    }
  };

  return (
    <div className="flex items-center gap-2">
      {/* Toggle theme button */}
      <Button
        variant="outline"
        className="rounded-full"
        size="icon"
        onClick={toggleTheme}
      >
        {/* Conditional rendering of Sun or Moon icon */}
        {theme === "light" ? (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>
    </div>
  );
};

export default DarkMode;
