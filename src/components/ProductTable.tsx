
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "./CustomerForm";

const PREDEFINED_PRODUCTS = [
  { id: "rice", name: "Rice", price: 50 },
  { id: "wheat", name: "Wheat", price: 40 },
  { id: "oil", name: "Cooking Oil", price: 150 },
  { id: "sugar", name: "Sugar", price: 45 },
  { id: "dal", name: "Dal (Lentils)", price: 80 },
  { id: "flour", name: "Wheat Flour", price: 35 },
  { id: "salt", name: "Salt", price: 20 },
  { id: "tea", name: "Tea", price: 200 },
];

interface ProductTableProps {
  onProductsUpdate: (products: Product[]) => void;
}

const ProductTable = ({ onProductsUpdate }: ProductTableProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  useEffect(() => {
    const selectedProducts: Product[] = PREDEFINED_PRODUCTS
      .filter(product => quantities[product.id] > 0)
      .map(product => ({
        ...product,
        quantity: quantities[product.id]
      }));
    
    onProductsUpdate(selectedProducts);
  }, [quantities, onProductsUpdate]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Product Selection
          <Badge variant="outline">{Object.values(quantities).filter(q => q > 0).length} items selected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Product Name</th>
                <th className="text-right p-3">Price (₹/kg)</th>
                <th className="text-center p-3">Quantity (kg)</th>
                <th className="text-right p-3">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {PREDEFINED_PRODUCTS.map((product) => {
                const quantity = quantities[product.id] || 0;
                const subtotal = product.price * quantity;
                
                return (
                  <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{product.name}</td>
                    <td className="p-3 text-right">₹{product.price}</td>
                    <td className="p-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="0"
                        value={quantity || ""}
                        onChange={(e) => handleQuantityChange(product.id, parseFloat(e.target.value) || 0)}
                        className="w-20 text-center mx-auto"
                      />
                    </td>
                    <td className="p-3 text-right font-medium">
                      {subtotal > 0 ? `₹${subtotal.toFixed(2)}` : "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductTable;
