import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Search, Users, ShoppingCart, Clock, CheckCircle2, Edit } from "lucide-react";
import CustomerForm from "./CustomerForm";
import { orderService, OrderData } from "@/services/orderService";

interface Order {
  id: string;
  name: string;
  phone: string;
  village: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  totalBill: number;
  createdAt: string;
  status: "pending" | "completed";
}

const AdminDashboard = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "completed">("all");
  const [editingOrder, setEditingOrder] = useState<(OrderData & { id: string }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const ordersData = await orderService.getOrders();
      setOrders(ordersData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
      console.error("Error loading orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const markOrderCompleted = async (orderId: string) => {
    try {
      await orderService.updateOrderStatus(orderId, "completed");
      await loadOrders(); // Refresh the orders list
      
      toast({
        title: "Order Marked as Completed",
        description: "Order status updated successfully",
      });

      console.log("Order marked as completed:", orderId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
      console.error("Error updating order status:", error);
    }
  };

  const handleEditOrder = (order: OrderData) => {
    // Ensure the order has an id before setting it for editing
    if (order.id) {
      setEditingOrder(order as OrderData & { id: string });
    }
  };

  const handleOrderSaved = async () => {
    setEditingOrder(null);
    await loadOrders(); // Refresh the orders list
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phone.includes(searchTerm) ||
                         order.village.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    completed: orders.filter(o => o.status === "completed").length,
    totalRevenue: orders.reduce((sum, order) => sum + order.totalBill, 0)
  };

  if (editingOrder) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Button onClick={() => setEditingOrder(null)} variant="outline">
            ← Back to Dashboard
          </Button>
          <h2 className="text-xl font-semibold">Editing Order: {editingOrder.name}</h2>
        </div>
        <CustomerForm 
          editingOrder={editingOrder} 
          onOrderSaved={handleOrderSaved}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                onClick={() => setFilterStatus("completed")}
                size="sm"
              >
                Completed
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{order.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {order.phone} • {order.village}
                    </p>
                  </div>
                  <div className="text-right flex flex-col gap-2">
                    <Badge variant={order.status === "pending" ? "secondary" : "default"}>
                      {order.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2">Products:</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {order.products.map((product, index) => (
                        <div key={index} className="flex justify-between items-center p-2 bg-muted rounded text-sm">
                          <span className="font-medium">{product.name}</span>
                          <span>Quantity: {product.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-lg">Total: ₹{order.totalBill.toFixed(2)}</span>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleEditOrder(order)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      {order.status === "pending" && order.id && (
                        <Button 
                          onClick={() => markOrderCompleted(order.id!)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
