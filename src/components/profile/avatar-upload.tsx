"use client";

import { useState, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Camera, Loader2, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarUploadProps {
  url: string | null;
  onUpload: (url: string) => void;
  userId: string;
}

export function AvatarUpload({ url, onUpload, userId }: AvatarUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      alert("Fadlan dooro sawir.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Sawirku waa inuu ka yaryahay 2MB.");
      return;
    }

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      onUpload(publicUrl);
    } catch (error) {
      console.error("Error uploading avatar:", error);
      alert("Waan ka xunnahay, sawirka lama soo galin karo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-muted flex items-center justify-center relative">
          {url ? (
            <Image
              src={url}
              alt="Avatar"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={64} className="text-muted-foreground" />
          )}
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={cn(
            "absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          <Camera size={18} />
        </button>
      </div>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <p className="text-xs text-muted-foreground text-center">
        Guji badanka si aad u beddesho sawirka.<br />
        (Max 2MB)
      </p>
    </div>
  );
}
