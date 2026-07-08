"use client";

export function ConversationListSkeleton() {
  return (
    <aside className="flex min-w-80 flex-col border-r border-gray-700 bg-gray-800">
      <div className="border-b border-gray-700 p-4">
        <div className="h-6 w-32 animate-pulse rounded bg-white/10" />
      </div>

      <div className="flex-1 space-y-3 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-xl p-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-white/10" />
            <div className="min-w-0 flex-1 space-y-2">
              <div className="h-4 w-1/2 animate-pulse rounded bg-white/10" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function MessageListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 6 }).map((_, i) => {
        const isMine = i % 2 === 1;

        return (
          <div key={i} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
            <div className="max-w-[70%] space-y-2">
              <div
                className={`h-3 w-24 animate-pulse rounded bg-white/10 ${
                  isMine ? "ml-auto" : ""
                }`}
              />

              <div className="space-y-3 rounded-2xl bg-white/10 p-4">
                {i === 1 && (
                  <div className="h-44 w-full animate-pulse rounded-xl bg-white/10" />
                )}
                <div className="h-4 w-48 animate-pulse rounded bg-white/15" />
              </div>

              <div
                className={`h-2.5 w-16 animate-pulse rounded bg-white/10 ${
                  isMine ? "ml-auto" : ""
                }`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6 text-center">
      <div className="max-w-sm space-y-2">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}


