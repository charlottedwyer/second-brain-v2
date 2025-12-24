import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  // 👇 explicitly use editor.commands to avoid TS augmentation bug
  const { commands, chain } = editor;

  return (
    <div>
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 8,
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => chain().focus().toggleBold().run()}>
          Bold
        </button>

        <button onClick={() => chain().focus().toggleItalic().run()}>
          Italic
        </button>

        <button
          onClick={() =>
            chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          H2
        </button>

        <button onClick={() => chain().focus().toggleBulletList().run()}>
          • List
        </button>

        <button onClick={() => chain().focus().toggleOrderedList().run()}>
          1. List
        </button>

        <button
          onClick={() => {
            commands.clearNodes();
            commands.unsetAllMarks();
          }}
        >
          Clear
        </button>
      </div>

      {/* Editor surface */}
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: 12,
          minHeight: 200,
          background: "var(--card)",
        }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
