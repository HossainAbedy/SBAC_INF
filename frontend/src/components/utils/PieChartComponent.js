import { Grid, Typography } from "@mui/material";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { COLORS } from "./RandomColors"; // Import a function for random color generation

const PieChartComponent = ({ title, data, dataKey, nameKey, onLegendClick, selectedKey }) => (
  <Grid item xs={12} md={6}>
    <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
      {title}
    </Typography>
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie 
        data={data} 
        dataKey={dataKey} 
        nameKey={nameKey} 
        cx="50%" 
        cy="50%" 
        outerRadius={100}
        fill="#8884d8"
        label={({ value, x, y }) => (
            <text x={x} y={y} textAnchor="middle" fontSize={16} fill={COLORS}>
                {value}
            </text>
        )}
        // label={({ name, count }) => `${name} ${(percent * 100).toFixed(1)}%`}
        // label={({ name, count }) => `${name} ${count}`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          wrapperStyle={{ overflowY: "auto", maxHeight: "150px", marginLeft: "20px" }}
          onClick={(e) => onLegendClick(e.value === selectedKey ? null : e.value)}
        />
      </PieChart>
    </ResponsiveContainer>
  </Grid>
);

export default PieChartComponent;