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
  "#F5022C", // Coral Red
  "#0055FE", // Blue
  "#03FF4A", // Mint Green
  "#FFD700", // Yellow
  "#000000", // Black
  "#CC671E", // Dark Orange
  "#008080", // Dark Turquoise
  "#00876F", // Dark Teal
  "#6A1B9A", // Dark Lavender
  "#D44A29", // Dark Salmon
  "#4B0082", // Dark Deep Blue (Indigo)
  "#007E82", // Dark Cyan
  "#7B1FA2", // Dark Purple
  "#C7156F", // Dark Pink
  "#CC7710", // Dark Peach
  "#6C1B8F", // Dark Purple
  "#A52A2A", // Dark Orange Red (Brown)
  "#104E8B", // Dark Dodger Blue
  "#228B22", // Dark Lime Green
  "#B8860B", // Dark Gold
  "#5D3FD3", // Dark Blue Violet
  "#C71585", // Dark Deep Pink
  "#008B45", // Dark Spring Green
  "#B35900", // Dark Dark Orange
  "#008B8B", // Dark Dark Turquoise
  "#C7156F", // Dark Hot Pink
  "#5B8C00", // Dark Chartreuse
  "#8B0000", // Dark Crimson
  "#0078AA", // Dark Deep Sky Blue
  "#B22222", // Dark Tomato
  "#483D8B", // Dark Slate Blue
  "#008080", // Dark Light Sea Green
  "#CD5C5C", // Dark Light Salmon
  "#6A5ACD", // Dark Medium Purple
  "#2E8B57", // Dark Medium Sea Green
  "#8B3A3A", // Dark Coral
  "#1A7B8B", // Dark Medium Turquoise
  "#800080", // Dark Medium Violet Red
  "#007B50", // Dark Medium Spring Green
  "#5D1F5D", // Dark Magenta
  "#B87333", // Dark Peach Puff (Copper)
  "#8B008B", // Dark Magenta
  "#6B8E23", // Dark Green Yellow
  "#4B0082", // Dark Indigo
  "#8B4513", // Dark Moccasin (SaddleBrown)
  "#5D9C4E", // Dark Lawn Green
  "#4B0082", // Dark Purple
  "#8B5A2B", // Dark Blanched Almond (Dark Brown)
  "#006400", // Dark Lime
  "#68228B", // Dark Dark Orchid
  "#3E2723", // Dark Floral White (Dark Brown)
  "#008B8B", // Dark Cyan
  "#5E0000", // Dark Dark Red
  "#A27D00", // Dark Lemon Chiffon (Dark Gold)
  "#500000", // Dark Maroon
  "#8B3A62", // Dark Misty Rose
  "#006400", // Dark Green
];

