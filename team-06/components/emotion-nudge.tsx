type Props = {
  title: string;
  message: string;
  onDismiss?: () => void;
};

/** Gentle in-app nudge banner — demo stand-in for push notifications. */
export default function EmotionNudge({ title, message, onDismiss }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start justify-between gap-3 rounded-[20px] border-4 border-[#0F172A] bg-[#FDE68A] p-4 shadow-[0_4px_0_#0F172A]"
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em]">{title}</p>
        <p className="mt-1 text-sm font-bold leading-relaxed">{message}</p>
      </div>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#0F172A] bg-white text-lg font-black touch-manipulation"
        >
          ×
        </button>
      ) : null}
    </div>
  );
}
