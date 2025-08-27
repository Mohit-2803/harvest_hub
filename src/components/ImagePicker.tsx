"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";

type Props = {
  id?: string;
  name: string;
  label?: string;
  accept?: string;
  required?: boolean;
  previewClassName?: string;
};

export default function ImagePicker({
  id = "image",
  name,
  label = "Product Image",
  accept = "image/*",
  required,
  previewClassName = "w-32 h-32 object-cover rounded-lg shadow-md",
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        type="file"
        accept={accept}
        required={required}
        onChange={handleImageChange}
      />
      {preview && (
        <div className="mt-3">
          <Image src={preview} alt="Preview" className={previewClassName} />
        </div>
      )}
    </div>
  );
}
