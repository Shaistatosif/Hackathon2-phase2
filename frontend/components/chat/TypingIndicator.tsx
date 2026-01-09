'use client';

export function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-[#2A2A2A] rounded-2xl px-4 py-3">
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-400 mr-2">AI is typing</span>
          <div className="flex gap-1">
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <span
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
