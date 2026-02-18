import { useEffect, useRef, useState } from "react";

interface Props {
  initialContent: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const DescriptionEditor = ({ initialContent, onChange, placeholder }: Props) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && initialContent && editorRef.current.innerHTML !== initialContent) {
      // Only set if empty to avoid cursor jumping, or handle diffs if needed.
      // For simple use case, we only set valid initial content once or if strictly controlled.
      if (!editorRef.current.innerHTML.trim()) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const items = e.clipboardData.items;

    for (const item of items) {
      if (item.type.indexOf("image") !== -1) {
        const blob = item.getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onload = (event) => {
            const img = document.createElement("img");
            img.src = event.target?.result as string;
            img.style.maxWidth = "100%";
            img.style.borderRadius = "8px";
            img.style.marginTop = "8px";
            img.style.marginBottom = "8px";

            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              range.deleteContents();
              range.insertNode(img);
              range.collapse(false);
            } else {
              editorRef.current?.appendChild(img);
            }
            handleInput();
          };
          reader.readAsDataURL(blob);
        }
      } else if (item.type === "text/plain") {
        item.getAsString((text) => {
          document.execCommand("insertText", false, text);
        });
      }
    }
  };

  return (
    <div className={`
        min-h-[150px] p-4 rounded-xl border transition-all cursor-text relative
        ${isFocused ? 'border-indigo-500 ring-4 ring-indigo-500/10 bg-white' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-white hover:border-indigo-300'}
    `}>
      <div
        ref={editorRef}
        contentEditable
        className="outline-none min-h-[150px] prose prose-sm max-w-none text-gray-700 font-medium"
        onInput={handleInput}
        onPaste={handlePaste}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
      />
      {!editorRef.current?.innerText && !isFocused && (
        <span className="absolute top-4 left-4 text-gray-400 pointer-events-none">
          {placeholder || "Add a description... (paste images here)"}
        </span>
      )}
    </div>
  );
};

export default DescriptionEditor;
