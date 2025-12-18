"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/login", {
        email,
        password,
      });

      console.log(res.data);
      localStorage.setItem("email", email);
      
      localStorage.setItem("isLogin", "true");
      alert("Login Successful!");
      router.push("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log(error.response?.data);
        alert(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      } else {
        console.log(error);
        alert("Something went wrong");
      }
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white dark:bg-zinc-900 p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-xl font-bold text-center mb-4 text-zinc-700 dark:text-zinc-200">
          Login
        </h2>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-zinc-700 dark:text-zinc-300 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
}
