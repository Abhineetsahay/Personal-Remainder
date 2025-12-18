"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AddTaskPage from "@/components/addTask";
import SeeAllTask from "@/components/seeAllTask";

export default function Page() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"add" | "view">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("activeTab");
      if (saved === "add" || saved === "view") return saved;
    }
    return "add";
  });

  useEffect(() => {
    const isLogin = JSON.parse(localStorage.getItem("isLogin") || "false");
    if (!isLogin) router.push("/");
  }, [router]);

  const changeTab = (tab: "add" | "view") => {
    setActiveTab(tab);
    localStorage.setItem("activeTab", tab);
  };

  const logOutHandler = () => {
    localStorage.setItem("isLogin", "false");
    localStorage.removeItem("activeTab");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 p-6 font-sans">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          Task Manager Dashboard
        </h1>

        <button
          onClick={logOutHandler}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Log Out
        </button>
      </header>

      <div className="flex gap-3 mb-6">
        <button
          onClick={() => changeTab("add")}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            activeTab === "add"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border"
          }`}
        >
          Add Task
        </button>

        <button
          onClick={() => changeTab("view")}
          className={`px-5 py-2 rounded-lg font-medium transition ${
            activeTab === "view"
              ? "bg-blue-600 text-white shadow"
              : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border"
          }`}
        >
          📋 See All Tasks
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow p-6">
        {activeTab === "add" ? <AddTaskPage /> : <SeeAllTask />}
      </div>
    </div>
  );
}
