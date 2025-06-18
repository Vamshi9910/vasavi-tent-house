
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Users, 
  ShoppingCart, 
  Clock, 
  CheckCircle2, 
  Edit, 
  Trash2,
  AlertTriangle,
  Printer
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  const handleDeleteOrder = async (orderId: string) => {
    try {
      await orderService.deleteOrder(orderId);
      await loadOrders(); // Refresh the orders list
      
      toast({
        title: "Order Deleted",
        description: "Order has been successfully deleted",
      });

      console.log("Order deleted:", orderId);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      });
      console.error("Error deleting order:", error);
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

  const handlePrintReceipt = (order: OrderData) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Receipt - ${order.name}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo {
              width: 100px;
              height: auto;
              margin-bottom: 10px;
            }
            .company-name {
              font-size: 24px;
              font-weight: bold;
              color: #7F1D1D;
              margin: 10px 0;
            }
            .company-info {
              font-size: 14px;
              color: #666;
              margin: 5px 0;
            }
            .customer-section {
              margin: 30px 0;
              border-bottom: 2px solid #7F1D1D;
              padding-bottom: 15px;
            }
            .customer-title {
              font-size: 18px;
              font-weight: bold;
              color: #7F1D1D;
              margin-bottom: 10px;
            }
            .customer-info {
              display: flex;
              justify-content: space-between;
              margin: 5px 0;
            }
            .products-table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            .products-table th,
            .products-table td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            .products-table th {
              background-color: #7F1D1D;
              color: white;
              font-weight: bold;
            }
            .products-table tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            .total-section {
              margin-top: 20px;
              text-align: right;
            }
            .total-amount {
              font-size: 20px;
              font-weight: bold;
              color: #7F1D1D;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 14px;
              color: #7F1D1D;
              font-weight: bold;
            }
            .footer-note {
              margin-top: 10px;
              font-size: 12px;
              color: #666;
              font-weight: normal;
            }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="/lovable-uploads/b00cf27b-7f76-4d35-8366-f010d8803060.png" alt="Company Logo" class="logo">
            <div class="company-name">Vasavi Tent House and Decorations</div>
            <div class="company-info">Cherupally Village, Dist Mulugu - 506172</div>
            <div class="company-info">Phone: 9121154704</div>
          </div>

          <div class="customer-section">
            <div class="customer-title">Customer Details</div>
            <div class="customer-info">
              <span><strong>Name:</strong> ${order.name}</span>
              <span><strong>Date:</strong> ${order.createdAt ? formatDate(order.createdAt) : 'N/A'}</span>
            </div>
            <div class="customer-info">
              <span><strong>Phone:</strong> ${order.phone}</span>
            </div>
            <div class="customer-info">
              <span><strong>Village:</strong> ${order.village}</span>
            </div>
          </div>

          <table class="products-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Item</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              ${order.products.map((product, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${product.name}</td>
                  <td>${product.quantity}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-amount">Total Amount: ₹${order.totalBill.toFixed(2)}</div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Vasavi Tent House and Decorations!</p>
            <p class="footer-note">This is a computer generated receipt.</p>
          </div>
        </body>
        </html>
      `;
      
      printWindow.document.write(receiptHTML);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
                      {order.createdAt ? formatDate(order.createdAt) : 'N/A'}
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
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t gap-2">
                    <span className="font-bold text-lg">Total: ₹{order.totalBill.toFixed(2)}</span>
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        onClick={() => handlePrintReceipt(order)}
                        size="sm"
                        variant="outline"
                        className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                      >
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                      </Button>
                      <Button 
                        onClick={() => handleEditOrder(order)}
                        size="sm"
                        variant="outline"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                              Delete Order
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete the order for <strong>{order.name}</strong>? 
                              This action cannot be undone and will permanently remove all order data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => order.id && handleDeleteOrder(order.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Order
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
