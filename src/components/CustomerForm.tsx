import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ProductTable from "./ProductTable";
import OrderSummary from "./OrderSummary";
import { orderService, OrderData } from "@/services/orderService";

export interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  receivedQuantity?: number;
}

export interface CustomerData {
  name: string;
  phone: string;
  village: string;
  products: Product[];
  totalBill: number;
}

interface CustomerFormProps {
  editingOrder?: OrderData & { id: string };
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmitOrder = async () => {
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

    setIsSubmitting(true);

    try {
      if (editingOrder) {
        // Update existing order
        await orderService.updateOrder(editingOrder.id, {
          ...customerData,
          status: "pending"
        });
      } else {
        // Create new order
        await orderService.createOrder(customerData);
      }

      setShowSummary(true);
      
      toast({
        title: "Order Registered Successfully!",
        description: "Order has been saved to database",
      });

      console.log("Order submitted:", customerData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save order. Please try again.",
        variant: "destructive"
      });
      console.error("Error submitting order:", error);
    } finally {
      setIsSubmitting(false);
    }
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
          <div className="mt-4">
            <Button 
              onClick={handleSubmitOrder}
              className="w-full"
              disabled={customerData.totalBill === 0 || customerData.products.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Saving..." : (editingOrder ? "Update Order" : "Register Order")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerForm;
