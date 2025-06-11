
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

interface CustomerFormProps {
  editingOrder?: CustomerData & { id: string; status: string };
  onOrderSaved?: () => void;
}

const CustomerForm = ({ editingOrder, onOrderSaved }: CustomerFormProps) => {
  const { toast } = useToast();
  const [customerData, setCustomerData] = useState<CustomerData>({
    name: editingOrder?.name || "",
    phone: editingOrder?.phone || "",
    village: editingOrder?.village || "",
    products: editingOrder?.products || [],
    totalBill: editingOrder?.totalBill || 0
  });

  const [showSummary, setShowSummary] = useState(false);

  const handleCustomerInfoChange = (field: string, value: string) => {
    setCustomerData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBillAmountChange = (amount: number) => {
    setCustomerData(prev => ({
      ...prev,
      totalBill: amount
    }));
  };

  const handleProductsUpdate = (products: Product[]) => {
    setCustomerData(prev => ({
      ...prev,
      products
    }));
  };

  const handleSavePartialOrder = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    if (editingOrder) {
      // Update existing order
      const updatedOrders = orders.map((order: any) => 
        order.id === editingOrder.id 
          ? { ...order, ...customerData, status: "partially_pending" }
          : order
      );
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
      
      toast({
        title: "Order Updated",
        description: "Order has been saved as partially pending",
      });
    } else {
      // Create new partial order
      const newOrder = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "partially_pending"
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      
      toast({
        title: "Order Saved",
        description: "Order has been saved as partially pending",
      });
    }

    if (onOrderSaved) {
      onOrderSaved();
    }

    console.log("Order saved as partially pending:", customerData);
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

    if (customerData.products.length === 0) {
      toast({
        title: "No Products Selected",
        description: "Please select at least one product with quantity",
        variant: "destructive"
      });
      return;
    }

    if (customerData.totalBill <= 0) {
      toast({
        title: "Invalid Bill Amount",
        description: "Please enter a valid bill amount",
        variant: "destructive"
      });
      return;
    }

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    if (editingOrder) {
      // Update existing order to pending
      const updatedOrders = orders.map((order: any) => 
        order.id === editingOrder.id 
          ? { ...order, ...customerData, status: "pending" }
          : order
      );
      localStorage.setItem("orders", JSON.stringify(updatedOrders));
    } else {
      // Create new pending order
      const newOrder = {
        ...customerData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        status: "pending"
      };
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
    }

    setShowSummary(true);
    
    toast({
      title: "Order Registered Successfully!",
      description: "WhatsApp and SMS notifications will be sent to the customer",
    });

    console.log("Order submitted:", customerData);
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
    if (onOrderSaved) {
      onOrderSaved();
    }
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

      <ProductTable 
        onProductsUpdate={handleProductsUpdate} 
        initialProducts={editingOrder?.products}
      />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="billAmount">Total Bill Amount</Label>
              <Input
                id="billAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter total bill amount"
                value={customerData.totalBill || ""}
                onChange={(e) => handleBillAmountChange(parseFloat(e.target.value) || 0)}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">Total Bill:</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{customerData.totalBill.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={handleSavePartialOrder}
              variant="outline"
              className="flex-1"
            >
              Save as Draft
            </Button>
            <Button 
              onClick={handleSubmitOrder}
              className="flex-1"
              disabled={customerData.totalBill === 0 || customerData.products.length === 0}
            >
              {editingOrder ? "Update & Send Notifications" : "Register Order & Send Notifications"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
