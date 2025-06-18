
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerForm from "@/components/CustomerForm";
import AdminDashboard from "@/components/AdminDashboard";
import { Users, ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex flex-col items-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/b00cf27b-7f76-4d35-8366-f010d8803060.png" 
              alt="Vasavi Tent House and Decorations Logo" 
              className="h-32 w-auto"
            />
            <h1 className="text-4xl font-bold text-red-900 mb-2">Vasavi Tent House and Decorations</h1>
          </div>
          <div className="text-red-700 text-lg">
            <p className="text-base">Cherupally Village, Dist Mulugu - 506172</p>
          </div>
        </header>

        <Tabs defaultValue="customer" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-red-100 border-red-200">
            <TabsTrigger value="customer" className="flex items-center gap-2 data-[state=active]:bg-red-800 data-[state=active]:text-white">
              <ShoppingCart className="h-4 w-4" />
              Customer Orders
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2 data-[state=active]:bg-red-800 data-[state=active]:text-white">
              <Users className="h-4 w-4" />
              Admin Dashboard
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer">
            <CustomerForm />
          </TabsContent>
          
          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
