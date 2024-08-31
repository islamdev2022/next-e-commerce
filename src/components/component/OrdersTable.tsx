"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { getOrders, getOrderItemsByOrderID, getProduct } from "@/app/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { useToast } from "../ui/use-toast";

export default function OrdersTable() {
  const [allOrders, setOrders] = useState<any[]>([]);
  const [date, setDate] = useState<Date>();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  interface OrderItem {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    productName?: string; // Add productName as an optional property
  }
  
  const [orderItems, setOrderItems] = useState<{ [key: string]: OrderItem[] }>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrdersAndItems = async () => {
      try {
        const fetchedOrders = await getOrders();
        setOrders(fetchedOrders);

        const itemsMap: { [key: string]: any[] } = {};
        for (const order of fetchedOrders) {
          const items: OrderItem[] = await getOrderItemsByOrderID(order.id);

          // Fetch product details for each item
          for (const item of items) {
            const product = await getProduct(item.productId);
            if (product !== null) {
              item.productName = product.name; // Assuming the product object has a `name` field
            }
          }

          itemsMap[order.id] = items;
        }
        setOrderItems(itemsMap);
      } catch (error) {
        console.error("Error fetching orders or items:", error);
      }
    };

    fetchOrdersAndItems();
  }, []);

  const filteredOrders = allOrders.filter((order) => {
    const dateMatch =
      !date || new Date(order.orderDate).toDateString() === date.toDateString();
    const itemsMatch =
      selectedItems.length === 0 ||
      selectedItems.some((item) =>
        orderItems[order.id]
          ?.map((oi) => oi.productId.toString())
          .includes(item)
      );
    return dateMatch && itemsMatch;
  });

  const handleOrderStateChange = async (orderId: string, newState: string) => {
    try {
      const response = await fetch(`/api/order/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId, orderState: newState }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update order state:", errorData.error);
        toast({
          title: `Failed to update order state`,
          description: errorData.error,
        });
        return;
      }
      toast({
        title: `Order ${orderId} state changed to ${newState}`,
      });

      const result = await response.json();
      if (result.success) {
        console.log(`Order ${orderId} state changed to ${newState}`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId
              ? { ...order, orderState: newState }
              : order
          )
        );
      } else {
        console.error("Failed to update order state:", result.error);
        toast({
          title: `Failed to update order state`,
          description: result.error,
        });
      }
    } catch (error) {
      console.error("Error updating order state:", error);
      toast({
        title: `Error updating order state`,
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between space-x-4 mb-4">
        <p className="text-2xl font-bold">Orders</p>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[240px] justify-start text-left font-normal"
            >
              {selectedItems.length > 0
                ? `${selectedItems.length} items selected`
                : "Filter by Product Id"}
              <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {Array.from(
              new Set(
                allOrders.flatMap((order) =>
                  orderItems[order.id]?.map((item) =>
                    item.productId.toString()
                  ) || []
                )
              )
            ).map((productId) => (
              <DropdownMenuCheckboxItem
                key={productId}
                checked={selectedItems.includes(productId)}
                onCheckedChange={(checked) =>
                  setSelectedItems((prevSelected) =>
                    checked
                      ? [...prevSelected, productId]
                      : prevSelected.filter((id) => id !== productId)
                  )
                }
              >
                Product ID: {productId}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Order State</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Items</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.totalPrice.toFixed(2)} DA</TableCell>
              <TableCell>{format(new Date(order.orderDate), "PPP")}</TableCell>
              <TableCell>
                <OrderStateSelect
                  currentState={order.orderState}
                  onStateChange={(newState) =>
                    handleOrderStateChange(order.id, newState)
                  }
                />
              </TableCell>
              <TableCell>{order.destination}</TableCell>
              <TableCell>{order.Name}</TableCell>
              <TableCell>{order.Phone}</TableCell>
              <TableCell>
                {orderItems[order.id]?.map((item) => (
                  <div key={item.id}>
                    Product: {item.productName}, Quantity: {item.quantity}
                  </div>
                )) || "No items"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const OrderStateSelect = ({
  currentState,
  onStateChange,
}: {
  currentState: string;
  onStateChange: (newState: string) => void;
}) => {
  const getColorClass = (state: string) => {
    switch (state) {
      case "CANCELED":
        return "text-red-500"; // Red for canceled
      case "COMPLETED":
        return "text-green-500"; // Green for completed
      default:
        return "text-gray-500"; // Gray for pending or default
    }
  };

  return (
    <Select value={currentState} onValueChange={onStateChange}>
      <SelectTrigger>
        <span className={getColorClass(currentState)}>{currentState}</span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="PENDING">
          <span className="text-gray-500">PENDING</span>
        </SelectItem>
        <SelectItem value="CANCELED">
          <span className="text-red-500">CANCELED</span>
        </SelectItem>
        <SelectItem value="COMPLETED">
          <span className="text-green-500">COMPLETED</span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
