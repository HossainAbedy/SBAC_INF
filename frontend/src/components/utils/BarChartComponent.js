import { Grid, Typography } from "@mui/material";
import { ResponsiveContainer, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis } from "recharts";
import { getRandomColor } from "./RandomColors"; // Import a function for random color generation

const BarChartComponent = ({ data, title, dataKey, nameKey, onLegendClick, selectedKey }) => (
    <Grid item xs={12} md={6}>
      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey={nameKey} />
          <YAxis />
          <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
          <Bar dataKey={dataKey} barSize={40}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={getRandomColor()} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Grid>
  );

  export default BarChartComponent;