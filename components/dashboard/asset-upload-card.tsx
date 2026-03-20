"use client";

import { useRef, useState } from "react";
import { Upload, ImageUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  CMS_UPLOAD_SIZE_LIMIT_LABEL,
  cn,
  getCmsImageUploadError,
} from "@/lib/utils";

export function AssetUploadCard({
  label,
  description,
  currentSrc,
  defaultSrc,
  targetType,
  targetKey,
  folder,
  pageKey,
  action,
  restoreAction,
}: {
  label: string;
  description: string;
  currentSrc: string;
  defaultSrc: string;
  targetType: "settings" | "page";
  targetKey: string;
  folder: string;
  pageKey?: string;
  action: (formData: FormData) => Promise<void>;
  restoreAction: (formData: FormData) => Promise<void>;
}) {
  const previewImageRef = useRef<HTMLImageElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isRestoreSubmitRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState("");
  const [currentDimensions, setCurrentDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const isUsingDefault = currentSrc === defaultSrc;

  function clearSelectedFile() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    setFileName("");
  }

  function handleSelectedFile(file: File | null) {
    if (!file) {
      clearSelectedFile();
      setFileError("");
      return;
    }

    const validationError = getCmsImageUploadError(file);

    if (validationError) {
      clearSelectedFile();
      setFileError(validationError);
      return;
    }

    setFileError("");
    setFileName(file.name);
  }

  function validateBeforeSubmit() {
    const file = inputRef.current?.files?.[0] ?? null;

    if (!file) {
      setFileError("Pilih file gambar terlebih dahulu.");
      return false;
    }

    const validationError = getCmsImageUploadError(file);

    if (validationError) {
      setFileError(validationError);
      return false;
    }

    setFileError("");
    return true;
  }

  return (
    <form
      action={action}
      className="border-brand-sand/70 rounded-[1.8rem] border bg-white p-5 shadow-[0_12px_30px_rgba(76,41,18,0.06)]"
      onSubmit={(event) => {
        if (isRestoreSubmitRef.current) {
          isRestoreSubmitRef.current = false;
          return;
        }

        if (validateBeforeSubmit()) {
          return;
        }

        event.preventDefault();
      }}
    >
      <input name="folder" type="hidden" value={folder} />
      <input name="targetType" type="hidden" value={targetType} />
      <input name="targetKey" type="hidden" value={targetKey} />
      {pageKey ? <input name="pageKey" type="hidden" value={pageKey} /> : null}

      <div className="bg-brand-surface overflow-hidden rounded-[1.5rem]">
        {currentSrc ? (
          <img
            alt={label}
            className="h-56 w-full object-cover"
            key={currentSrc}
            onLoad={(event) => {
              setCurrentDimensions({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              });
            }}
            ref={previewImageRef}
            src={currentSrc}
          />
        ) : (
          <div className="text-brand-body flex h-56 items-center justify-center text-sm">
            Belum ada asset
          </div>
        )}
      </div>

      <div className="mt-5">
        <h3 className="font-epilogue text-brand-ink text-xl font-bold">
          {label}
        </h3>
        <p className="text-brand-body mt-2 text-sm leading-6">{description}</p>
        <p className="text-brand-body mt-2 text-xs leading-6">
          {isUsingDefault
            ? "Sedang memakai asset default."
            : "Sedang memakai asset kustom."}
        </p>
        {currentDimensions ? (
          <p className="text-brand-maroon mt-2 text-xs leading-6 font-semibold">
            Rekomendasi ukuran: {currentDimensions.width} ×{" "}
            {currentDimensions.height} px
          </p>
        ) : null}
      </div>

      <div
        className={cn(
          "border-brand-sand/80 bg-brand-surface mt-5 rounded-[1.4rem] border border-dashed p-5 transition",
          isDragging && "border-brand-maroon bg-brand-shell",
        )}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          const file = event.dataTransfer.files?.[0];

          if (!file || !inputRef.current) {
            return;
          }

          const validationError = getCmsImageUploadError(file);

          if (validationError) {
            clearSelectedFile();
            setFileError(validationError);
            return;
          }

          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          inputRef.current.files = dataTransfer.files;
          handleSelectedFile(file);
        }}
      >
        <div className="flex items-start gap-3">
          <ImageUp className="text-brand-maroon mt-0.5 h-5 w-5" />
          <div>
            <p className="text-brand-ink text-sm font-semibold">
              Drag & drop asset di sini
            </p>
            <p className="text-brand-body mt-1 text-sm leading-6">
              Atau pilih file manual. Cocok untuk logo, hero image, dan showcase
              visual.
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            accept="image/*"
            className="hidden"
            name="assetFile"
            onChange={(event) =>
              handleSelectedFile(event.target.files?.[0] ?? null)
            }
            ref={inputRef}
            type="file"
          />
          <Button
            onClick={() => inputRef.current?.click()}
            size="sm"
            type="button"
            variant="secondary"
          >
            <Upload className="h-4 w-4" />
            Pilih file
          </Button>
          <span className="text-brand-body text-sm">
            {fileName || "Belum ada file dipilih"}
          </span>
        </div>
        {fileError ? (
          <p className="mt-3 rounded-[0.9rem] border border-[#831618]/18 bg-[#831618]/8 px-3 py-2 text-sm font-medium text-[#831618]">
            {fileError}
          </p>
        ) : (
          <p className="text-brand-body mt-3 text-xs leading-6">
            Gunakan gambar hingga {CMS_UPLOAD_SIZE_LIMIT_LABEL}.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button
          onClick={() => {
            isRestoreSubmitRef.current = false;
          }}
          type="submit"
        >
          Ganti asset
        </Button>
        <Button
          disabled={isUsingDefault}
          formAction={restoreAction}
          formNoValidate
          onClick={(event) => {
            isRestoreSubmitRef.current = true;

            if (
              !isUsingDefault &&
              !window.confirm(
                "Pulihkan asset ini ke versi default bawaan situs?",
              )
            ) {
              isRestoreSubmitRef.current = false;
              event.preventDefault();
            }
          }}
          type="submit"
          variant="outline"
        >
          Restore default
        </Button>
      </div>
    </form>
  );
}
