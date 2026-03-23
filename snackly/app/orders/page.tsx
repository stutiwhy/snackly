"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const userId = 2; // Hardcoded for now

    useEffect(() => {
        const fetchOrders = () => {
            fetch(`http://localhost:5000/api/orders/history/${userId}`)
                .then((res) => res.json())
                .then((data) => setOrders(data));
        };

        fetchOrders(); // Initial fetch
        const interval = setInterval(fetchOrders, 10000); // Refresh every 10 seconds

        return () => clearInterval(interval); // Cleanup on leave
    }, []);

    // Helper to color-code the status
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Delivered": return "bg-green-500";
            case "Preparing": return "bg-orange-500 animate-pulse";
            case "Out for Delivery": return "bg-blue-500 animate-bounce";
            case "Cancelled": return "bg-destructive";
            default: return "bg-secondary";
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black italic tracking-tighter mb-8">My Orders</h1>

            <div className="space-y-4">
                {orders.length === 0 ? (
                    <p className="text-muted-foreground italic">No orders yet. Go get some popcorn!</p>
                ) : (
                    orders.map((order: any) => (
                        <Card key={order.order_id} className="border-primary/10 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div>
                                    <CardTitle className="text-sm text-muted-foreground uppercase">
                                        Order #{order.order_id}
                                    </CardTitle>
                                    <p className="text-xs font-mono">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <Badge className={`${getStatusColor(order.order_status)} text-white`}>
                                    {order.order_status}
                                </Badge>
                            </CardHeader>
                            <CardContent className="flex justify-between items-center">
                                <div className="text-sm font-medium">
                                    Hall {order.hall_number} • Seat {order.seat_number}
                                </div>
                                <div className="text-2xl font-black">₹{order.total_price}</div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}