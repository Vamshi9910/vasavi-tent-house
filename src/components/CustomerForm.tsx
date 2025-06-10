
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  village: string;
  products: Product[];
  totalBill: number;
}

const CustomerForm = () => {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: "",
    phone: "",
    village: "",
    products: [],
    totalBill: 0
  });

  const [showSummary, setShowSummary] = useState(false);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProductsUpdate = (products: Product[]) => {
    const totalBill = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
    setCustomerData(prev => ({
      ...prev,
      products,
      totalBill
    }));
  };

  const handleSubmitOrder = () => {
    if (!customerData.name || !customerData.phone || !customerData.village) {
      toast({
        title: "Missing Information",
        description: "Please fill in all customer details",
        variant: "destructive"
      });
      return;
    }

    if (customerData.products.length === 0 || customerData.totalBill === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product with quantity",
        variant: "destructive"
      });
      return;
    }

    // Store order in localStorage for demo (will be replaced with database)
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    const newOrder = {
      ...customerData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: "pending"
    };
    orders.push(newOrder);
    localStorage.setItem("orders", JSON.stringify(orders));

    setShowSummary(true);
    
    toast({
      title: "Order Registered Successfully!",
      description: "WhatsApp and SMS notifications will be sent to the customer",
    });

    console.log("Order submitted:", newOrder);
    console.log("Triggering WhatsApp and SMS for:", customerData.phone);
  };

  const handleNewOrder = () => {
    setCustomerData({
      name: "",
      phone: "",
      village: "",
      products: [],
      totalBill: 0
    });
    setShowSummary(false);
  };

  if (showSummary) {
    return <OrderSummary customerData={customerData} onNewOrder={handleNewOrder} />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Customer Information
            <Badge variant="secondary">Required</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              placeholder="Enter customer name"
              value={customerData.name}
              onChange={(e) => handleCustomerInfoChange("name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              value={customerData.phone}
              onChange={(e) => handleCustomerInfoChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="village">Village Name</Label>
            <Input
              id="village"
              placeholder="Enter village name"
              value={customerData.village}
              onChange={(e) => handleCustomerInfoChange("village", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <ProductTable onProductsUpdate={handleProductsUpdate} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-semibold">Total Bill:</span>
            <span className="text-2xl font-bold text-green-600">
              ₹{customerData.totalBill.toFixed(2)}
            </span>
          </div>
          <Button 
            onClick={handleSubmitOrder}
            className="w-full"
            size="lg"
            disabled={customerData.totalBill === 0}
          >
            Register Order & Send Notifications
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
