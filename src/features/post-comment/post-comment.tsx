import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Smile } from 'lucide-react';

const PostCommentComponent: React.FC<{
  comment: string;
  setComment: (v: string) => void;
  onPost: () => void;
  emojiOpen: boolean;
  setEmojiOpen: (v: boolean) => void;
  inputRef:
    | React.RefObject<HTMLInputElement>
    | React.MutableRefObject<HTMLInputElement | null>;
  rememberCaret: () => void;
  insertAtCaret: (t: string) => void;
  EMOJIS: string[];
  btnSizeClass: string; // e.g. "w-10 h-10" or "w-12 h-12"
  inputHeightClass: string; // e.g. "h-10" or "h-12"
}> = ({
  comment,
  setComment,
  onPost,
  emojiOpen,
  setEmojiOpen,
  inputRef,
  rememberCaret,
  insertAtCaret,
  EMOJIS,
  btnSizeClass,
  inputHeightClass,
}) => {
  return (
    <form
      className="flex items-center gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        if (comment.trim()) onPost();
      }}
    >
      <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={`${btnSizeClass} border-2 border-border rounded-2xl flex items-center justify-center cursor-pointer hover:bg-background/80 transition-colors`}
            aria-label="Insert emoji"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => {
              inputRef.current?.focus();
              rememberCaret();
            }}
          >
            <Smile />
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={8} className="w-72 p-2">
          <div className="mb-2 text-xs text-muted-foreground px-1">
            Quick emojis
          </div>
          <div
            className="grid grid-cols-8 gap-1"
            role="grid"
            aria-label="Emoji picker"
          >
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                className="text-2xl leading-none p-2 rounded-md hover:bg-accent hover:scale-[1.05] transition"
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => {
                  insertAtCaret(e);
                  setEmojiOpen(false);
                }}
                aria-label={`Insert ${e}`}
              >
                {e}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onClick={rememberCaret}
          onKeyUp={rememberCaret}
          onSelect={rememberCaret}
          placeholder="Add Comment"
          className={`w-full ${inputHeightClass} bg-background/80 border border-border rounded-2xl px-4 outline-none transition-colors`}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm font-semibold"
        >
          Post
        </button>
      </div>
    </form>
  );
};

export default PostCommentComponent;
