import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/components/CustomerForm";

export interface OrderData {
  id?: string;
  name: string;
  phone: string;
  village: string;
  products: Product[];
  totalBill: number;
  status: "pending" | "completed";
  createdAt?: string;
  updatedAt?: string;
}

export const orderService = {
  async createOrder(orderData: Omit<OrderData, 'id' | 'status' | 'createdAt' | 'updatedAt'>) {
    try {
      // Insert the main order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          name: orderData.name,
          phone: orderData.phone,
          village: orderData.village,
          total_bill: orderData.totalBill,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert the order products
      const orderProducts = orderData.products.map(product => ({
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        price: product.price
      }));

      const { error: productsError } = await supabase
        .from('order_products')
        .insert(orderProducts);

      if (productsError) throw productsError;

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getOrders(): Promise<OrderData[]> {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      // Get products for each order
      const ordersWithProducts = await Promise.all(
        orders.map(async (order) => {
          const { data: products, error: productsError } = await supabase
            .from('order_products')
            .select('*')
            .eq('order_id', order.id);

          if (productsError) throw productsError;

          return {
            id: order.id,
            name: order.name,
            phone: order.phone,
            village: order.village,
            totalBill: Number(order.total_bill),
            status: order.status as "pending" | "completed", // Type assertion to fix the status type
            createdAt: order.created_at,
            products: products.map(p => ({
              id: p.product_id,
              name: p.product_name,
              quantity: Number(p.quantity),
              price: Number(p.price)
            }))
          } as OrderData;
        })
      );

      return ordersWithProducts;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  },

  async updateOrderStatus(orderId: string, status: "pending" | "completed") {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },

  async updateOrder(orderId: string, orderData: Omit<OrderData, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      // Update the main order
      const { error: orderError } = await supabase
        .from('orders')
        .update({
          name: orderData.name,
          phone: orderData.phone,
          village: orderData.village,
          total_bill: orderData.totalBill,
          status: orderData.status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Delete existing products
      const { error: deleteError } = await supabase
        .from('order_products')
        .delete()
        .eq('order_id', orderId);

      if (deleteError) throw deleteError;

      // Insert updated products
      const orderProducts = orderData.products.map(product => ({
        order_id: orderId,
        product_id: product.id,
        product_name: product.name,
        quantity: product.quantity,
        price: product.price
      }));

      const { error: productsError } = await supabase
        .from('order_products')
        .insert(orderProducts);

      if (productsError) throw productsError;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  },

  async deleteOrder(orderId: string) {
    try {
      // Delete order products first (due to foreign key constraint)
      const { error: productsError } = await supabase
        .from('order_products')
        .delete()
        .eq('order_id', orderId);

      if (productsError) throw productsError;

      // Delete the main order
      const { error: orderError } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (orderError) throw orderError;
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }
};
