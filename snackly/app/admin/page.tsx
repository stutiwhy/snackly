"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AdminDashboard() {

    interface ConversionStats {
        total_customers: number;
        customers_who_ordered: number;
    }

    interface AdminStats {
        rankings: any[];
        conversion: ConversionStats | null; // Use null initially
        occupancy: any[];
    }
    const [orders, setOrders] = useState<any[]>([]);
    const [snacks, setSnacks] = useState<any[]>([]);

    // Initialize with the interface
    const [stats, setStats] = useState<AdminStats>({
        rankings: [],
        conversion: null,
        occupancy: []
    });

    // ... rest of your useEffect and fetch logic

    const loadAllData = async () => {
        const [ord, snk, rank, conv, occ] = await Promise.all([
            fetch("http://localhost:5000/api/admin/orders").then(res => res.json()),
            fetch("http://localhost:5000/api/snacks").then(res => res.json()),
            fetch("http://localhost:5000/api/rankings").then(res => res.json()),
            fetch("http://localhost:5000/api/conversion").then(res => res.json()),
            fetch("http://localhost:5000/api/occupancy").then(res => res.json()),
        ]);
        setOrders(ord);
        setSnacks(snk);
        setStats({ rankings: rank, conversion: conv, occupancy: occ });
    };

    useEffect(() => { loadAllData(); }, []);

    const updateStatus = async (id: number, status: string) => {
        await fetch("http://localhost:5000/api/admin/orders/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order_id: id, status })
        });
        loadAllData();
    };

    const updateInventory = async (id: number, price: number, stock: number) => {
        await fetch("http://localhost:5000/api/inventory/update", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, price, stock })
        });
        loadAllData();
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-6xl font-black italic tracking-tighter text-primary">ADMIN</h1>
                    <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Snackly Operations Dashboard</p>
                </div>
            </header>

            <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1">
                    <TabsTrigger value="orders" className="font-bold uppercase italic">Live Orders</TabsTrigger>
                    <TabsTrigger value="inventory" className="font-bold uppercase italic">Inventory Management</TabsTrigger>
                    <TabsTrigger value="analytics" className="font-bold uppercase italic">Business Insights</TabsTrigger>
                </TabsList>

                {/* --- ORDERS TAB --- */}
                <TabsContent value="orders">
                    <Card>
                        <CardHeader><CardTitle>Active Customer Requests</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Location</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Update Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orders.map((o: any) => (
                                        <TableRow key={o.order_id}>
                                            <TableCell className="font-black">#{o.order_id}</TableCell>
                                            <TableCell className="font-medium">{o.username}</TableCell>
                                            <TableCell>H{o.hall_number} - {o.seat_number}</TableCell>
                                            <TableCell className="font-bold text-primary">₹{o.total_price}</TableCell>
                                            <TableCell>
                                                <Select onValueChange={(val) => updateStatus(o.order_id, val)} defaultValue={o.order_status}>
                                                    <SelectTrigger className="w-[180px] font-bold">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {["Pending", "Preparing", "Out for Delivery", "Delivered", "Cancelled"].map(s => (
                                                            <SelectItem key={s} value={s}>{s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- INVENTORY TAB --- */}
                <TabsContent value="inventory">
                    <Card>
                        <CardHeader><CardTitle>Manage Snack Stock & Pricing</CardTitle></CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Price (₹)</TableHead>
                                        <TableHead>Stock Level</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {snacks.map((s: any) => (
                                        <TableRow key={s.snack_id}>
                                            <TableCell className="font-bold">{s.name}</TableCell>
                                            <TableCell>
                                                <Input type="number" className="w-24 font-mono" defaultValue={s.price}
                                                    onBlur={(e) => updateInventory(s.snack_id, parseInt(e.target.value), s.stock_quantity)} />
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Input type="number" className="w-24 font-mono" defaultValue={s.stock_quantity}
                                                        onBlur={(e) => updateInventory(s.snack_id, s.price, parseInt(e.target.value))} />
                                                    {s.stock_quantity < 10 && <Badge variant="destructive" className="animate-pulse">LOW</Badge>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="ghost" className="text-destructive font-bold text-xs">DELETE</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ANALYTICS TAB --- */}
                <TabsContent value="analytics" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-primary/5 border-primary/20">
                            <CardHeader>
                                <CardTitle className="text-xs uppercase opacity-70 tracking-widest">
                                    Conversion Rate
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-black italic tracking-tighter">
                                    {/* 1. Add the check here */}
                                    {stats.conversion
                                        ? ((stats.conversion.customers_who_ordered / stats.conversion.total_customers) * 100).toFixed(1)
                                        : "0.0"}%
                                </p>
                                <p className="text-xs text-muted-foreground mt-2 font-bold uppercase">
                                    {/* 2. Use Optional Chaining (?.) for the labels */}
                                    {stats.conversion?.customers_who_ordered ?? 0} orders from {stats.conversion?.total_customers ?? 0} users
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-xs uppercase opacity-70">Bestsellers (Ranked)</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                {stats.rankings.slice(0, 3).map((r: any) => (
                                    <div key={r.name} className="flex justify-between text-sm border-b pb-1">
                                        <span className="font-bold">#{r.sales_rank} {r.name}</span>
                                        <span className="font-mono">{r.total_sold} units</span>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader><CardTitle className="text-xs uppercase opacity-70">Top Hall Revenue</CardTitle></CardHeader>
                            <CardContent>
                                {stats.occupancy.slice(0, 1).map((h: any) => (
                                    <div key={h.hall_number}>
                                        <p className="text-4xl font-black italic">Hall {h.hall_number}</p>
                                        <p className="text-xs text-muted-foreground">Revenue: ₹{h.revenue}</p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}