"use client";

export default function ReloadButton() {
  return (
    <button
      className="btn btn-primary mt-6 inline-block"
      onClick={() => window.location.reload()}
    >
      Tekrar dene
    </button>
  );
}
