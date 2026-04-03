"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FaFacebook,
  FaThumbsUp,
  FaComment,
  FaShare,
  FaUserCircle,
  FaSearch,
  FaHome,
  FaUserFriends,
  FaVideo,
  FaBell,
  FaBars,
} from "react-icons/fa";

type User = {
  id: number;
  name: string;
  email: string;
  password: string;
};

type Post = {
  id: number;
  author: string;
  message: string;
  createdAt: string;
};

const defaultPosts: Post[] = [
  {
    id: 1,
    author: "Facebook Team",
    message: "Welcome! Signup or login to share your first post.",
    createdAt: new Date().toISOString(),
  },
];

export default function Home() {
  const [isSignup, setIsSignup] = useState(false);
  const [auth, setAuth] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [postInput, setPostInput] = useState("");
  const [posts, setPosts] = useState<Post[]>(defaultPosts);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const savedAuth = localStorage.getItem("fb-clone-auth");
    const savedUsers = localStorage.getItem("fb-clone-users");
    const savedPosts = localStorage.getItem("fb-clone-posts");
    if (savedAuth) setAuth(JSON.parse(savedAuth));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedPosts) setPosts(JSON.parse(savedPosts));
  }, []);

  useEffect(() => {
    localStorage.setItem("fb-clone-users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (auth) localStorage.setItem("fb-clone-auth", JSON.stringify(auth));
    else localStorage.removeItem("fb-clone-auth");
  }, [auth]);

  useEffect(() => {
    localStorage.setItem("fb-clone-posts", JSON.stringify(posts));
  }, [posts]);

  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => Number(new Date(b.createdAt)) - Number(new Date(a.createdAt)));
  }, [posts]);

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setFeedback("Please fill all fields.");
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === form.email.toLowerCase())) {
      setFeedback("Email already exists.");
      return;
    }

    const newUser: User = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
    };

    setUsers((prev) => [...prev, newUser]);
    setAuth(newUser);
    setForm({ name: "", email: "", password: "" });
    setFeedback("Signed up and logged in successfully!");
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const found = users.find(
      (user) => user.email.toLowerCase() === form.email.toLowerCase() && user.password === form.password
    );

    if (!found) {
      setFeedback("Login failed: invalid credentials.");
      return;
    }

    setAuth(found);
    setForm({ name: "", email: "", password: "" });
    setFeedback("Logged in successfully!");
  }

  function handlePost(e: React.FormEvent) {
    e.preventDefault();
    const message = postInput.trim();
    if (!message) {
      setFeedback("Please type something to post.");
      return;
    }

    const newPost: Post = {
      id: Date.now(),
      author: auth?.name ?? "Unknown",
      message,
      createdAt: new Date().toISOString(),
    };

    setPosts((prev) => [newPost, ...prev]);
    setPostInput("");
    setFeedback("Post created!");
  }

  function handleLogout() {
    setAuth(null);
    setFeedback("Logged out.");
  }

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <header className="mb-4 rounded-xl bg-white p-3 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-600">
            <FaFacebook size={26} />
            <span className="text-xl font-bold">Facebook</span>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <button className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Home</button>
            <button className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Friends</button>
            <button className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Watch</button>
            <button className="rounded-lg px-3 py-2 text-sm hover:bg-slate-100">Notifications</button>
          </div>
          {auth ? (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline">{auth.name}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </header>

      {!auth ? (
        <main className="mx-auto max-w-xl rounded-xl bg-white p-5 shadow-md">
          <h1 className="mb-4 text-2xl font-bold">{isSignup ? "Sign up" : "Log in"}</h1>
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="mb-1 block text-sm font-medium">Name</label>
                <input
                  className="w-full rounded-lg border border-slate-300 p-2"
                  value={form.name}
                  onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Your name"
                  required
                />
              </div>
            )}
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                className="w-full rounded-lg border border-slate-300 p-2"
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                placeholder="you@mail.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Password</label>
              <input
                className="w-full rounded-lg border border-slate-300 p-2"
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                placeholder="******"
                required
              />
            </div>
            <button className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700" type="submit">
              {isSignup ? "Create Account" : "Login"}
            </button>
            <button
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-100"
              type="button"
              onClick={() => {
                setIsSignup((prev) => !prev);
                setFeedback("");
              }}
            >
              {isSignup ? "Already have an account? Login" : "Need an account? Sign up"}
            </button>
          </form>

          {feedback && <p className="mt-3 rounded-lg bg-slate-100 p-2 text-sm text-slate-600">{feedback}</p>}
        </main>
      ) : (
        <main className="mx-auto flex max-w-5xl gap-4 md:flex-row flex-col">
          <aside className="hidden w-1/4 rounded-xl bg-white p-4 shadow-md md:block">
            <h2 className="mb-3 text-lg font-semibold">Quick Links</h2>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-center gap-2"><FaHome /> Home</li>
              <li className="flex items-center gap-2"><FaUserFriends /> Friends</li>
              <li className="flex items-center gap-2"><FaVideo /> Watch</li>
              <li className="flex items-center gap-2"><FaBell /> Notifications</li>
              <li className="flex items-center gap-2"><FaSearch /> Search</li>
            </ul>
          </aside>

          <section className="w-full md:w-3/4 space-y-4">
            <article className="rounded-xl bg-white p-4 shadow-md">
              <div className="flex items-center gap-2">
                <FaUserCircle size={24} className="text-blue-600" />
                <p className="text-lg font-semibold">Create Post</p>
              </div>
              <form onSubmit={handlePost} className="mt-3 space-y-3">
                <textarea
                  className="w-full resize-none rounded-lg border border-slate-300 p-3"
                  value={postInput}
                  onChange={(e) => setPostInput(e.target.value)}
                  rows={4}
                  placeholder="What's on your mind?"
                />
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                  Post
                </button>
              </form>
            </article>

            <section className="h-[70vh] overflow-y-auto rounded-xl bg-white p-4 shadow-md">
              <h2 className="mb-4 text-xl font-semibold">Feed</h2>
              {sortedPosts.length === 0 && <p>No posts yet.</p>}
              <div className="space-y-3">
                {sortedPosts.map((post) => (
                  <article key={post.id} className="rounded-lg border border-slate-200 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <FaUserCircle size={18} className="text-blue-600" />
                      <div>
                        <p className="font-semibold">{post.author}</p>
                        <p className="text-xs text-slate-500">{new Date(post.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-slate-800">{post.message}</p>
                    <div className="mt-3 flex gap-6 text-slate-600">
                      <span className="flex items-center gap-1"><FaThumbsUp /> Like</span>
                      <span className="flex items-center gap-1"><FaComment /> Comment</span>
                      <span className="flex items-center gap-1"><FaShare /> Share</span>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </section>
        </main>
      )}
    </div>
  );
}
