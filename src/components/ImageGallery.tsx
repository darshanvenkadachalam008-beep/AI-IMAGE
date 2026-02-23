import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Download, Trash2, Loader2, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface GeneratedImage {
  id: string;
  prompt: string;
  image_url: string;
  generation_type: string;
  created_at: string;
}

interface ImageGalleryProps {
  userId: string;
}

const ImageGallery = ({ userId }: ImageGalleryProps) => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [loadedThumbnails, setLoadedThumbnails] = useState<Set<string>>(new Set());
  const PAGE_SIZE = 12;

  useEffect(() => {
    fetchImages();
  }, [userId]);

  const fetchImages = async (loadMore = false) => {
    try {
      const currentPage = loadMore ? page + 1 : 0;
      
      const { data, error } = await supabase
        .from("generated_images")
        .select("id, prompt, image_url, generation_type, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .range(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE - 1);

      if (error) throw error;
      
      const newImages = data || [];
      setHasMore(newImages.length === PAGE_SIZE);
      
      if (loadMore) {
        setImages(prev => [...prev, ...newImages]);
        setPage(currentPage);
      } else {
        setImages(newImages);
        setPage(0);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  };

  const handleThumbnailLoad = (id: string) => {
    setLoadedThumbnails(prev => new Set(prev).add(id));
  };

  const downloadImage = async (imageUrl: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `aurea-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success("Image downloaded!");
    } catch (error) {
      toast.error("Failed to download image");
    }
  };

  const deleteImage = async (id: string, imageUrl: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      const { error } = await supabase
        .from("generated_images")
        .delete()
        .eq("id", id);

      if (error) throw error;

      if (imageUrl.includes('generated-images')) {
        try {
          const urlPath = new URL(imageUrl).pathname;
          const storagePath = urlPath.split('/generated-images/')[1];
          if (storagePath) {
            await supabase.storage
              .from('generated-images')
              .remove([decodeURIComponent(storagePath)]);
          }
        } catch (storageError) {
          console.error("Failed to delete from storage:", storageError);
        }
      }

      setImages(images.filter((img) => img.id !== id));
      if (selectedImage?.id === id) setSelectedImage(null);
      toast.success("Image deleted");
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-12 text-center">
        <p className="text-muted-foreground text-lg">
          No images yet. Start creating to build your gallery!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative aspect-square bg-secondary rounded-lg overflow-hidden cursor-pointer border border-border hover:border-primary transition-all hover:shadow-glow-md"
            >
              {!loadedThumbnails.has(image.id) && (
                <Skeleton className="absolute inset-0" />
              )}
              <img
                src={image.image_url}
                alt={image.prompt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  loadedThumbnails.has(image.id) ? 'opacity-100' : 'opacity-0'
                }`}
                loading="lazy"
                onLoad={() => handleThumbnailLoad(image.id)}
              />
              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="w-8 h-8 text-primary" />
              </div>
            </div>
          ))}
        </div>
        
        {hasMore && (
          <div className="flex justify-center">
            <Button
              onClick={() => fetchImages(true)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Load More
            </Button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-foreground hover:bg-secondary"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-6 h-6" />
          </Button>
          
          <div 
            className="max-w-4xl max-h-[90vh] flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.image_url}
              alt={selectedImage.prompt}
              className="max-w-full max-h-[70vh] object-contain rounded-lg border border-border"
            />
            <div className="bg-card border border-border rounded-lg p-4 space-y-3">
              <p className="text-sm text-foreground">{selectedImage.prompt}</p>
              <div className="flex gap-2">
                <Button
                  onClick={(e) => downloadImage(selectedImage.image_url, e)}
                  variant="outline"
                  size="sm"
                  className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </Button>
                <Button
                  onClick={(e) => deleteImage(selectedImage.id, selectedImage.image_url, e)}
                  variant="outline"
                  size="sm"
                  className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;
