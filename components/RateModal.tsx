"use client";

import { useState } from "react";
import { Place } from "@/types";
import StarRating from "./StarRating";

interface RateModalProps {
  place: Place;
  onSubmit: (rating: number, review: string) => void;
  onClose: () => void;
}

export default function RateModal({ place, onSubmit, onClose }: RateModalProps) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    await onSubmit(rating, review);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="glass w-full max-w-md rounded-3xl p-6 shadow-2xl border border-brand-rose/20 animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-xs text-brand-purple/70 uppercase tracking-widest font-medium mb-1">
              How was it?
            </p>
            <h2 className="font-display text-2xl font-bold">{place.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white/70 transition-colors p-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-white/50 mb-2">Your rating</label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          <div>
            <label htmlFor="review" className="block text-sm text-white/50 mb-2">
              Leave a note <span className="text-white/30">(optional)</span>
            </label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Food was amazing, music was too loud, would come back for brunch..."
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-white/20 focus:outline-none focus:border-brand-purple/50 resize-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-roulette"
          >
            {submitting ? "Saving…" : "Save & Archive"}
          </button>
        </form>
      </div>
    </div>
  );
}
