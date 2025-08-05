require("dotenv").config();  // Add at the top

const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const ipoRoutes = require("./routes/ipo.routes");
const adminRoutes = require("./routes/admin.routes");

const cors = require("cors");
const express = require('express');
const app = express();
app.use(express.json());
app.use(cors()); // <-- allow requests from Angular

app.use("/api/auth", authRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/ipos", ipoRoutes);
app.use("/api/admin", adminRoutes);
const PORT = process.env.PORT || 5000;

// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});