"use client";

import { Place } from "@/types";
import StarRating from "./StarRating";

interface PlaceCardProps {
  place: Place;
  variant?: "selected" | "history";
  onMarkVisited?: (id: string) => void;
}

export default function PlaceCard({
  place,
  variant = "history",
  onMarkVisited,
}: PlaceCardProps) {
  const instagramHandle = place.instagram_link
    ? place.instagram_link.replace(/https?:\/\/(www\.)?instagram\.com\/?/, "").replace(/\/$/, "")
    : null;

  return (
    <div
      className={`glass rounded-2xl p-5 transition-all duration-300 ${
        variant === "selected"
          ? "border border-brand-rose/40 shadow-lg shadow-brand-rose/10"
          : "hover:border-brand-purple/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg leading-tight truncate">{place.name}</h3>

          {instagramHandle && (
            <a
              href={place.instagram_link!}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-1.5 text-sm text-brand-purple hover:text-brand-pink transition-colors"
            >
              <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @{instagramHandle}
            </a>
          )}

          {place.note && (
            <p className="mt-2 text-sm text-white/60 line-clamp-2">{place.note}</p>
          )}
        </div>

        <span
          className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${
            place.status === "visited"
              ? "bg-green-500/15 text-green-400"
              : place.status === "selected"
              ? "bg-brand-rose/15 text-brand-rose"
              : "bg-white/10 text-white/50"
          }`}
        >
          {place.status === "visited" ? "Visited" : place.status === "selected" ? "This week" : "Unvisited"}
        </span>
      </div>

      {place.status === "visited" && place.rating && (
        <div className="mt-3 pt-3 border-t border-white/5">
          <StarRating value={place.rating} readonly size="sm" />
          {place.review && (
            <p className="mt-1.5 text-sm text-white/60 italic">"{place.review}"</p>
          )}
        </div>
      )}

      {variant === "selected" && place.status === "selected" && onMarkVisited && (
        <button
          onClick={() => onMarkVisited(place.id)}
          className="mt-4 w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-brand-rose/30 text-sm font-medium transition-all duration-200 text-white/70 hover:text-white"
        >
          Mark as Visited & Rate
        </button>
      )}
    </div>
  );
}
