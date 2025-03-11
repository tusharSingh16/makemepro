"use client";

import Sidebar from "./sideBar/SideBar";
import Dashboard from "./main/Dashboard";
import { useState } from "react";


export default function AdminDashboard() {
    const [value ,setValue] = useState<string>("dashboard");

  return (
    <div className="flex min-h-screen">

      <Sidebar value ={value} setValue={setValue}/>

      <Dashboard value ={value} setValue={setValue}/>
    </div>
  );
}
