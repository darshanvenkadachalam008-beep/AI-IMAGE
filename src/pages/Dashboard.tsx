import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Sparkles, LogOut, Image as ImageIcon, Upload, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import TextToImageGenerator from "@/components/TextToImageGenerator";
import ImageToImageGenerator from "@/components/ImageToImageGenerator";
import ImageGallery from "@/components/ImageGallery";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/");
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-primary text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none opacity-50" />
      
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary animate-glow" />
            <h1 className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              AureaVision
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate("/")}
              variant="outline"
              className="border-border hover:bg-secondary"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-border hover:bg-secondary"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              Create Stunning Images
            </h2>
            <p className="text-muted-foreground">
              Unlimited generation powered by advanced AI
            </p>
          </div>

          <Tabs defaultValue="text-to-image" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
              <TabsTrigger 
                value="text-to-image"
                className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Text to Image
              </TabsTrigger>
              <TabsTrigger 
                value="image-to-image"
                className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground"
              >
                <Upload className="w-4 h-4 mr-2" />
                Image to Image
              </TabsTrigger>
              <TabsTrigger 
                value="gallery"
                className="data-[state=active]:bg-gradient-gold data-[state=active]:text-primary-foreground"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Gallery
              </TabsTrigger>
            </TabsList>

            <TabsContent value="text-to-image">
              <TextToImageGenerator userId={user.id} />
            </TabsContent>

            <TabsContent value="image-to-image">
              <ImageToImageGenerator userId={user.id} />
            </TabsContent>

            <TabsContent value="gallery">
              <ImageGallery userId={user.id} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;