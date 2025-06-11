
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Product } from "./CustomerForm";

const PREDEFINED_PRODUCTS = [
  { id: "rice", name: "Rice" },
  { id: "wheat", name: "Wheat" },
  { id: "oil", name: "Cooking Oil" },
  { id: "sugar", name: "Sugar" },
  { id: "dal", name: "Dal (Lentils)" },
  { id: "flour", name: "Wheat Flour" },
  { id: "salt", name: "Salt" },
  { id: "tea", name: "Tea" },
];

interface ProductTableProps {
  onProductsUpdate: (products: Product[]) => void;
  initialProducts?: Product[];
  isDraft?: boolean;
}

const ProductTable = ({ onProductsUpdate, initialProducts, isDraft = false }: ProductTableProps) => {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const [receivedQuantities, setReceivedQuantities] = useState<{ [key: string]: number }>({});

  // Initialize quantities from initial products
  useEffect(() => {
    if (initialProducts) {
      const initialQuantities: { [key: string]: number } = {};
      const initialReceivedQuantities: { [key: string]: number } = {};
      initialProducts.forEach(product => {
        initialQuantities[product.id] = product.quantity;
        initialReceivedQuantities[product.id] = product.receivedQuantity || 0;
      });
      setQuantities(initialQuantities);
      setReceivedQuantities(initialReceivedQuantities);
    }
  }, [initialProducts]);

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  const handleReceivedQuantityChange = (productId: string, receivedQuantity: number) => {
    setReceivedQuantities(prev => ({
      ...prev,
      [productId]: receivedQuantity
    }));
  };

  useEffect(() => {
    const selectedProducts: Product[] = PREDEFINED_PRODUCTS
      .filter(product => quantities[product.id] > 0)
      .map(product => ({
        ...product,
        price: 0,
        quantity: quantities[product.id],
        receivedQuantity: receivedQuantities[product.id] || 0
      }));
    
    onProductsUpdate(selectedProducts);
  }, [quantities, receivedQuantities, onProductsUpdate]);

  const getRemainingQuantity = (productId: string) => {
    const actual = quantities[productId] || 0;
    const received = receivedQuantities[productId] || 0;
    return Math.max(0, actual - received);
  };

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
                <th className="text-center p-3">Actual Quantity</th>
                {isDraft && (
                  <>
                    <th className="text-center p-3">Received Quantity</th>
                    <th className="text-center p-3">Remaining</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {PREDEFINED_PRODUCTS.map((product) => {
                const quantity = quantities[product.id] || 0;
                const receivedQuantity = receivedQuantities[product.id] || 0;
                const remaining = getRemainingQuantity(product.id);
                
                return (
                  <tr key={product.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-medium">{product.name}</td>
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
                    {isDraft && (
                      <>
                        <td className="p-3">
                          <Input
                            type="number"
                            min="0"
                            max={quantity}
                            step="0.5"
                            placeholder="0"
                            value={receivedQuantity || ""}
                            onChange={(e) => handleReceivedQuantityChange(product.id, parseFloat(e.target.value) || 0)}
                            className="w-20 text-center mx-auto"
                          />
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-medium ${remaining > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                            {remaining}
                          </span>
                        </td>
                      </>
                    )}
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
