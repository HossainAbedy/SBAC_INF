export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  
// Define chart colors
export const COLORS = [
  // Original colors
  "#F5022C", // Coral Red
  "#0055FE", // Blue
  "#03FF4A", // Mint Green
  "#FFD700", // Yellow
  "#000000", // Black
  
  // New additions (11 vibrant colors)
  "#FF8042", // Orange
  "#40E0D0", // Turquoise
  "#00C49F", // Teal
  "#A463F2", // Lavender
  "#FF6E4A", // Salmon
  "#7C4DFF", // Deep Blue
  "#00D0D6", // Cyan
  "#AF19FF", // Purple
  "#FF55A3", // Pink
  "#FFA343", // Peach
  "#9C27B0", // Dark Purple
];