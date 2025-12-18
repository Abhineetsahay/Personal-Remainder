"use client";

import { useState, FormEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      const res = await axios.post("/api/signin", {
        name,
        email,
        password,
      });
      localStorage.setItem("isLogin", "true");
      
      localStorage.setItem("email", email);
      console.log(res.data);
      alert("User Created Successfully!");
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
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow"
      >
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2 font-medium transition"
        >
          Submit
        </button>
        <div >
          <Link href="/login">
            Already have Account? <span className="text-blue-400">Login</span>
          </Link>
        </div>
      </form>
    </div>
  );
}
