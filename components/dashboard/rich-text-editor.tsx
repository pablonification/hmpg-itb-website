"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon, LinkIcon, LoaderCircleIcon } from "lucide-react";
import { useEditor, EditorContent } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";

import { cn } from "@/lib/utils";

export function RichTextEditor({
  name,
  initialValue,
  onDirty,
}: {
  name: string;
  initialValue: string;
  onDirty?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [htmlValue, setHtmlValue] = useState(initialValue);
  const [uploadError, setUploadError] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: false,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: "Tulis isi laporan di sini...",
      }),
    ],
    content: initialValue,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[24rem] rich-text rounded-3xl border border-brand-stroke/30 bg-white px-6 py-5 focus:outline-none",
      },
    },
    onUpdate({ editor: activeEditor }) {
      setHtmlValue(activeEditor.getHTML());
      onDirty?.();
    },
  });

  useEffect(() => {
    if (!editor) {
      return;
    }

    editor.commands.setContent(initialValue);
    setHtmlValue(initialValue);
  }, [editor, initialValue]);

  async function handleImageFileChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");
    setIsUploadingImage(true);

    try {
      const formData = new FormData();
      formData.set("file", file);

      const response = await fetch("/api/dashboard/report-images", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(payload?.error ?? "Gagal mengunggah gambar.");
      }

      const payload = (await response.json()) as { src: string };
      editor
        ?.chain()
        .focus()
        .setImage({ src: payload.src, alt: file.name })
        .run();
      editor?.chain().focus().createParagraphNear().run();
      onDirty?.();
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Gagal mengunggah gambar.",
      );
    } finally {
      event.target.value = "";
      setIsUploadingImage(false);
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {[
          {
            label: "Bold",
            action: () => editor?.chain().focus().toggleBold().run(),
          },
          {
            label: "Italic",
            action: () => editor?.chain().focus().toggleItalic().run(),
          },
          {
            label: "Heading",
            action: () =>
              editor?.chain().focus().toggleHeading({ level: 2 }).run(),
          },
          {
            label: "List",
            action: () => editor?.chain().focus().toggleBulletList().run(),
          },
          {
            label: "Quote",
            action: () => editor?.chain().focus().toggleBlockquote().run(),
          },
          {
            label: "Link",
            action: () => {
              const href = window.prompt("Masukkan URL");
              if (!href) {
                return;
              }

              editor?.chain().focus().setLink({ href }).run();
            },
            icon: <LinkIcon size={14} />,
          },
          {
            label: isUploadingImage ? "Uploading..." : "Image",
            action: () => {
              if (isUploadingImage) {
                return;
              }

              fileInputRef.current?.click();
            },
            icon: isUploadingImage ? (
              <LoaderCircleIcon className="animate-spin" size={14} />
            ) : (
              <ImageIcon size={14} />
            ),
          },
        ].map((item) => (
          <button
            className={cn(
              "border-brand-stroke/30 bg-brand-surface text-brand-ink inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold tracking-[0.16em] uppercase",
              item.label === "Bold" &&
                editor?.isActive("bold") &&
                "border-brand-maroon",
              item.label === "Italic" &&
                editor?.isActive("italic") &&
                "border-brand-maroon",
              item.label === "Image" &&
                isUploadingImage &&
                "border-brand-maroon",
            )}
            key={item.label}
            onClick={item.action}
            type="button"
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>

      <input
        accept="image/*"
        className="hidden"
        data-testid="rich-text-image-upload"
        onChange={handleImageFileChange}
        ref={fileInputRef}
        type="file"
      />
      <input name={name} type="hidden" value={htmlValue} />
      <EditorContent editor={editor} />
      {uploadError ? (
        <p className="font-manrope text-brand-maroon text-sm">{uploadError}</p>
      ) : null}
    </div>
  );
}
