import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const InfraDashboard = () => {
  const [categories, setCategories] = useState([]);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    fetch("/api/device-categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  return (
    <div className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link to={`/category/${category.id}`} key={category.id}>
          <Card className="p-4 hover:shadow-lg transition">
            <CardContent>
              <h2 className="text-xl font-bold">{category.name}</h2>
              <p className="text-sm text-gray-500">{category.deviceCount} Devices</p>
            </CardContent>
          </Card>
        </Link>
      ))}
      {user?.role === "admin" && (
        <Link to="/admin">
          <Button className="w-full">Manage Devices</Button>
        </Link>
      )}
    </div>
  );
};

export default InfraDashboard;
