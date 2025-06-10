
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CustomerData } from "./CustomerForm";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";

interface OrderSummaryProps {
  customerData: CustomerData;
  onNewOrder: () => void;
}

const OrderSummary = ({ customerData, onNewOrder }: OrderSummaryProps) => {
  return (
    <div className="space-y-6">
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="h-5 w-5" />
            Order Registered Successfully!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <MessageCircle className="h-4 w-4" />
              WhatsApp message sent to {customerData.phone}
            </div>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Phone className="h-4 w-4" />
              SMS notification sent to {customerData.phone}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Customer Name</p>
              <p className="font-medium">{customerData.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone Number</p>
              <p className="font-medium">{customerData.phone}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Village</p>
              <p className="font-medium">{customerData.village}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-3">Products Ordered</h4>
            <div className="space-y-2">
              {customerData.products.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-2 bg-muted rounded">
                  <span>{product.name}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{product.quantity} kg</Badge>
                    <span className="font-medium">₹{(product.price * product.quantity).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Bill:</span>
            <span className="text-green-600">₹{customerData.totalBill.toFixed(2)}</span>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h5 className="font-medium text-blue-900 mb-2">Reminder Schedule</h5>
            <p className="text-sm text-blue-700">
              The customer will receive automatic reminders every 24 hours to submit their products until the order is marked as completed.
            </p>
          </div>

          <Button onClick={onNewOrder} className="w-full" size="lg">
            Register New Order
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderSummary;
