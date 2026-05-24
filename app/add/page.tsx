"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AddPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [instagramLink, setInstagramLink] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError("");

    const { error: dbError } = await supabase.from("places").insert({
      name: name.trim(),
      instagram_link: instagramLink.trim() || null,
      note: note.trim() || null,
      status: "unvisited",
    });

    if (dbError) {
      setError("Something went wrong. Please try again.");
      setSaving(false);
      return;
    }

    setSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 1200);
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
        <div className="text-6xl animate-bounce">💕</div>
        <h2 className="font-display text-2xl font-bold gradient-text">Date spot added!</h2>
        <p className="text-white/50 text-sm">Taking you to the roulette…</p>
      </div>
    );
  }

  return (
    <div className="pt-10">
      <div className="mb-8">
        <p className="text-brand-purple/70 text-sm font-medium tracking-widest uppercase mb-2">
          New Date Spot
        </p>
        <h1 className="font-display text-3xl font-bold gradient-text">
          Add a Place
        </h1>
        <p className="mt-2 text-white/40 text-sm">
          Found somewhere cute? Add it to the pool!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Place Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
            Place Name <span className="text-brand-rose">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Nobu, The Brooklyn Mirage..."
            className="w-full glass rounded-xl px-4 py-3.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 border border-transparent transition-colors"
          />
        </div>

        {/* Instagram Link */}
        <div>
          <label htmlFor="ig" className="block text-sm font-medium text-white/70 mb-2">
            Instagram Link{" "}
            <span className="text-white/30 font-normal">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </span>
            <input
              id="ig"
              type="url"
              value={instagramLink}
              onChange={(e) => setInstagramLink(e.target.value)}
              placeholder="https://www.instagram.com/nobu_restaurant"
              className="w-full glass rounded-xl pl-11 pr-4 py-3.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 border border-transparent transition-colors"
            />
          </div>
        </div>

        {/* Note */}
        <div>
          <label htmlFor="note" className="block text-sm font-medium text-white/70 mb-2">
            Note <span className="text-white/30 font-normal">(optional)</span>
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Why you want to go, what to try, dress code..."
            rows={3}
            className="w-full glass rounded-xl px-4 py-3.5 text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 border border-transparent transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-brand-rose text-sm bg-brand-rose/10 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={!name.trim() || saving}
          className="btn-roulette w-full py-4 rounded-xl font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saving ? "Adding…" : "Add to the Pool ✨"}
        </button>
      </form>
    </div>
  );
}
