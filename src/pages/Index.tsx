
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomerForm from "@/components/CustomerForm";
import AdminDashboard from "@/components/AdminDashboard";
import { Users, ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Vasavi Tent House and Decorations</h1>
          <div className="text-muted-foreground text-lg space-y-1">
            <p>Customer Order Management & Automated Messaging</p>
            <p className="text-base">Cherupally Village, Dist Mulugu - 506172</p>
          </div>
        </header>

        <Tabs defaultValue="customer" className="w-full max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="customer" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Customer Orders
            </TabsTrigger>
            <TabsTrigger value="admin" className="flex items-center gap-2">
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
