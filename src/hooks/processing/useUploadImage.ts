import { useState } from "react";
import { imageService } from "@/api/services/importService";
import { envConfig } from "@/api/config/env";

export function useUploadImage() {
  const [isLoading, setIsLoading] = useState(false);

  const upload = async (file: File) => {
    setIsLoading(true);
    try {
      const data = await imageService.uploadProfileImage(file);
      
      // Monta a URL final para o Front
      const newUrl = `${envConfig.minio.minioBaseUrl}/${envConfig.minio.minioImageBucket}/${data.object}`;
      
      return { success: true, newUrl, data };
    } catch (error) {
      console.error(error);
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return { upload, isLoading };
}