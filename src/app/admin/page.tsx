'use client';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, LogOut, FileDown, Eye, EyeOff, ShieldCheck, 
  ShoppingCart, BarChart3, Package, Users, Calendar, TrendingUp 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, subDays, startOfMonth, endOfMonth, eachWeekOfInterval, isSameMonth, subMonths, startOfYear, eachMonthOfInterval } from 'date-fns';
import { es } from 'date-fns/locale';

import { useCartStore } from '@/stores/cart-store';
import type { Product, ProductOption } from '@/lib/data';
import type { OrderData } from '@/lib/orders-db';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;


const categories = [
    { name: 'Ropa', color: [220, 38, 38], filter: (p: Product) => p.category === 'ropa' },
    { name: 'Suplementos', color: [138, 43, 226], filter: (p: Product) => p.category === 'suplemento' },
    { name: 'Accesorios', color: [100, 149, 237], filter: (p: Product) => p.category === 'accesorio' || p.category === 'joyeria' },
];

export default function AdminPage() {
  const products = useCartStore((state) => state.products);
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders();
    }
  }, [isAuthenticated]);

  const loadOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const fetchedOrders = await response.json();
        const mappedOrders = fetchedOrders.map((o: any) => ({
          ...o,
          createdAt: o.createdAt ? new Date(o.createdAt) : new Date()
        }));
        setOrders(mappedOrders);
      } else {
        console.error('Error fetching orders from API:', response.statusText);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        toast({ title: '¡Acceso Concedido!', description: 'Has iniciado sesión en el portal seguro.' });
      } else {
        const errData = await response.json();
        toast({
          title: 'Error de Seguridad',
          description: errData.error || 'Credenciales inválidas. Intento registrado.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error at admin login:', error);
      toast({
        title: 'Error de Red',
        description: 'No se pudo conectar con el servidor de seguridad.',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({ title: 'Sesión Finalizada', description: 'Has salido del portal correctamente.' });
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const today = new Date();
    const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    
    doc.text(`REPORTE INVENTARIO - ${dateStr}`, 14, 15);
    let startY = 25;
    const categoryTotals: { name: string; stock: number }[] = [];
    let grandTotalStock = 0;

    categories.forEach(category => {
        const categoryProducts = products.filter(category.filter);
        if (categoryProducts.length === 0) return;

        const tableColumn = ["ID", "Producto", "Color", "Talla/Opción", "Precio", "Stock"];
        const availableRows: (string | number)[][] = [];
        const unavailableRows: (string | number)[][] = [];
        let totalStock = 0;

        categoryProducts.forEach(product => {
            const processOption = (option: ProductOption, colorName: string = 'N/A') => {
                const row = [
                    product.id,
                    product.name,
                    colorName,
                    option.value,
                    product.price,
                    option.stock,
                ];
                if (option.stock > 0) {
                    availableRows.push(row);
                    totalStock += option.stock;
                } else {
                    unavailableRows.push(row);
                }
            };

            if (product.colors && product.colors.length > 0) {
                product.colors.forEach(color => {
                    color.options.values.forEach(option => processOption(option, color.name));
                });
            } else {
                product.options.values.forEach(option => processOption(option));
            }
        });

        categoryTotals.push({ name: category.name, stock: totalStock });
        grandTotalStock += totalStock;

        doc.setFontSize(16);
        doc.setTextColor(category.color[0], category.color[1], category.color[2]);
        if (startY > 250) { 
            doc.addPage();
            startY = 15;
        }
        doc.text(category.name, 14, startY);
        doc.setTextColor(0, 0, 0);
        startY += 8;

        if (availableRows.length > 0) {
            const summaryRow = [{
                content: `Total Disponible: ${totalStock} unidades`,
                colSpan: 6,
                styles: { halign: 'right', fontStyle: 'bold', fillColor: [230, 255, 230] }
            }];

            (doc as any).autoTable({
                head: [tableColumn],
                body: [...availableRows, summaryRow],
                startY: startY,
                headStyles: { fillColor: [22, 163, 74] },
            });
            startY = (doc as any).autoTable.previous.finalY + 2;
        }

        if (unavailableRows.length > 0) {
            (doc as any).autoTable({
                head: [tableColumn],
                body: unavailableRows,
                startY: startY,
                headStyles: { fillColor: [220, 38, 38] },
                styles: { fillColor: [254, 226, 226] } 
            });
            startY = (doc as any).autoTable.previous.finalY + 2;
        }
        
        if (availableRows.length === 0 && unavailableRows.length === 0) {
          doc.setFontSize(10);
          doc.text("No hay productos en esta categoría.", 14, startY);
          startY += 10;
        }

        startY += 10;
    });

    if (startY > 220) {
        doc.addPage();
        startY = 15;
    } else {
        startY += 10;
    }

    doc.setFontSize(16);
    doc.text("Resumen General de Inventario", 14, startY);
    startY += 10;

    const summaryBody = categoryTotals.map(ct => [ct.name, ct.stock]);
    
    (doc as any).autoTable({
        head: [['Categoría', 'Total de Unidades Disponibles']],
        body: summaryBody,
        startY: startY,
        headStyles: { fillColor: [41, 128, 185] },
        footStyles: { fillColor: [44, 62, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
        foot: [[ 'Gran Total de Inventario', grandTotalStock ]]
    });

    doc.save(`REPORTE INVENTARIO - ${dateStr}.pdf`);
  };

  // --- Statistics Calculation ---
  const statsData = useMemo(() => {
    if (orders.length === 0) return { weekly: [], monthly: [], yearly: [] };

    const now = new Date();
    
    // Weekly (Last 7 days)
    const weeklyData = eachDayOfInterval({
      start: subDays(now, 6),
      end: now
    }).map(day => {
      const dayOrders = orders.filter(o => isSameDay(new Date(o.createdAt), day));
      const total = dayOrders.reduce((acc, curr) => acc + curr.orderTotal, 0);
      return {
        name: format(day, 'EEE', { locale: es }),
        total: Math.round(total)
      };
    });

    // Monthly (Current month by weeks)
    const monthStart = startOfMonth(now);
    const monthEnd = endOfMonth(now);
    const weeklyInMonthData = eachWeekOfInterval({ start: monthStart, end: monthEnd }).map((week, idx) => {
      const weekOrders = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d >= week && d < subDays(week, -7) && isSameMonth(d, now);
      });
      const total = weekOrders.reduce((acc, curr) => acc + curr.orderTotal, 0);
      return {
        name: `Sem ${idx + 1}`,
        total: Math.round(total)
      };
    });

    // Yearly (Months)
    const yearlyData = eachMonthOfInterval({
      start: startOfYear(now),
      end: now
    }).map(month => {
      const monthOrders = orders.filter(o => isSameMonth(new Date(o.createdAt), month));
      const total = monthOrders.reduce((acc, curr) => acc + curr.orderTotal, 0);
      return {
        name: format(month, 'MMM', { locale: es }),
        total: Math.round(total)
      };
    });

    return { 
      weekly: weeklyData, 
      monthly: weeklyInMonthData, 
      yearly: yearlyData,
      totalRevenue: orders.reduce((acc, curr) => acc + curr.orderTotal, 0),
      totalOrders: orders.length,
      avgOrder: orders.length > 0 ? (orders.reduce((acc, curr) => acc + curr.orderTotal, 0) / orders.length) : 0
    };
  }, [orders]);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Neon background effect */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full"></div>
        
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-zinc-950 p-10 shadow-[0_0_20px_rgba(255,0,0,0.3)] border border-red-900/30 relative z-10">
          <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4 text-zinc-400 hover:text-red-500 hover:bg-red-950/20 transition-all">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
          
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-red-950/30 rounded-full border border-red-500/30 shadow-[0_0_15px_rgba(255,0,0,0.2)]">
              <ShieldCheck className="h-8 w-8 text-red-500" />
            </div>
            <h1 className="text-center text-3xl font-bold tracking-tight text-white pt-2">
              Panel <span className="text-red-600">Admin</span>
            </h1>
            <p className="text-zinc-500 text-sm">Acceso restringido para Zona Fit GT</p>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <div className="space-y-2">
              <Input 
                {...form.register('username')} 
                placeholder="Usuario" 
                className="bg-zinc-900/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 py-6 text-white placeholder:text-zinc-600 rounded-xl"
              />
              {form.formState.errors.username && <p className="text-red-500 text-xs px-1">{form.formState.errors.username.message}</p>}
            </div>

            <div className="space-y-2 relative">
              <Input 
                {...form.register('password')} 
                type={showPassword ? "text" : "password"} 
                placeholder="Contraseña" 
                className="bg-zinc-900/50 border-zinc-800 focus:border-red-500/50 focus:ring-red-500/20 py-6 text-white placeholder:text-zinc-600 rounded-xl pr-12"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-[14px] text-zinc-600 hover:text-red-500 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
              {form.formState.errors.password && <p className="text-red-500 text-xs px-1">{form.formState.errors.password.message}</p>}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-6 rounded-xl shadow-[0_4px_15px_rgba(255,0,0,0.3)] border border-red-500/30 active:scale-[0.98] transition-all" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Verificando...' : 'Autenticar Acceso'}
            </Button>
          </form>
          
          <div className="text-center pt-2">
            <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Encriptación SHA-256 Activa</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white selection:bg-red-600/30">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/10 blur-[150px] rounded-full"></div>
      
      {/* Sidebar / Header area */}
      <div className="border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="h-8 w-1 bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.8)]"></div>
             <h1 className="text-2xl font-black italic tracking-tighter">
                ZONA <span className="text-red-600">FIT</span> ADMIN
             </h1>
          </div>
          
          <Button variant="ghost" onClick={handleLogout} className="text-zinc-400 hover:text-red-500 hover:bg-red-950/20">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="stats" className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <TabsList className="bg-zinc-950 border border-zinc-900 p-1 h-auto rounded-2xl">
              <TabsTrigger value="stats" className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-xl py-2 px-6 font-bold flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Estadísticas
              </TabsTrigger>
              <TabsTrigger value="ventas" className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-xl py-2 px-6 font-bold flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" /> Ventas
              </TabsTrigger>
              <TabsTrigger value="inventario" className="data-[state=active]:bg-red-700 data-[state=active]:text-white rounded-xl py-2 px-6 font-bold flex items-center gap-2">
                <Package className="h-4 w-4" /> Inventario
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 bg-zinc-950 px-4 py-2 rounded-xl border border-zinc-900">
               <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Sistema de Datos Real</span>
            </div>
          </div>

          {/* ESTADÍSTICAS */}
          <TabsContent value="stats" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <TrendingUp className="h-20 w-20 text-red-600" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-zinc-500 text-xs font-black uppercase tracking-widest">Ingresos Totales</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-white">Q{statsData.totalRevenue?.toLocaleString() || 0}</p>
                  <p className="text-green-500 text-xs mt-2 font-bold flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" /> Historizado en Cloud
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <ShoppingCart className="h-20 w-20 text-red-600" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-zinc-500 text-xs font-black uppercase tracking-widest">Pedidos Realizados</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-white">{statsData.totalOrders || 0}</p>
                  <p className="text-zinc-500 text-xs mt-2">Ventas reales registradas</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                   <Users className="h-20 w-20 text-red-600" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-zinc-500 text-xs font-black uppercase tracking-widest">Ticket Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-black text-white">Q{Math.round(statsData.avgOrder || 0).toLocaleString()}</p>
                  <p className="text-zinc-500 text-xs mt-2">Por cada orden procesada</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-zinc-950 border-zinc-900 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-8">
                   <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-red-600" /> Rendimiento Semanal
                   </CardTitle>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={statsData.weekly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                        itemStyle={{ color: '#ef4444', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="total" fill="#b91c1c" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="bg-zinc-950 border-zinc-900 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-8">
                   <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" /> Histórico Anual
                   </CardTitle>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={statsData.yearly}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                         contentStyle={{ backgroundColor: '#09090b', border: '1px solid #18181b', borderRadius: '12px' }}
                      />
                      <Area type="monotone" dataKey="total" stroke="#ef4444" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* VENTAS */}
          <TabsContent value="ventas" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <Card className="bg-zinc-950 border-zinc-900 rounded-3xl overflow-hidden">
                <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
                   <h2 className="text-xl font-bold">Listado de Ventas Recientes</h2>
                   <Button variant="outline" size="sm" onClick={loadOrders} className="bg-black border-zinc-800 text-zinc-400 hover:text-white">
                      Refrescar Datos
                   </Button>
                </div>
                <Table>
                  <TableHeader className="bg-zinc-900/50">
                    <TableRow className="border-zinc-800 hover:bg-transparent">
                      <TableHead className="text-zinc-500 font-bold">Orden #</TableHead>
                      <TableHead className="text-zinc-500 font-bold">Cliente</TableHead>
                      <TableHead className="text-zinc-500 font-bold">Resumen de Productos</TableHead>
                      <TableHead className="text-zinc-500 font-bold">Método de Pago</TableHead>
                      <TableHead className="text-zinc-500 font-bold text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingOrders ? (
                      <TableRow>
                         <TableCell colSpan={5} className="text-center py-20 text-zinc-500">Cargando ventas de Firestore...</TableCell>
                      </TableRow>
                    ) : orders.length === 0 ? (
                      <TableRow>
                         <TableCell colSpan={5} className="text-center py-20 text-zinc-500">No se han registrado ventas todavía.</TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order, idx) => (
                        <TableRow key={idx} className="border-zinc-900 hover:bg-zinc-900/20 transition-colors">
                          <TableCell className="font-bold">#{order.orderId}</TableCell>
                          <TableCell>
                             <div className="flex flex-col">
                                <span className="font-medium text-white">{order.shippingInfo.firstName} {order.shippingInfo.lastName}</span>
                                <span className="text-xs text-zinc-500">{order.shippingInfo.phone}</span>
                             </div>
                          </TableCell>
                          <TableCell>
                             <div className="max-w-[300px] truncate text-zinc-400 text-xs">
                                {order.orderItems.map(i => `${i.quantity}x ${i.name}`).join(', ')}
                             </div>
                          </TableCell>
                          <TableCell>
                             <Badge className={order.shippingInfo.paymentMethod === 'cod' ? "bg-orange-500/10 text-orange-500 border-none" : "bg-cyan-500/10 text-cyan-500 border-none"}>
                                {order.shippingInfo.paymentMethod === 'cod' ? 'Contra Entrega' : 'Depósito'}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right font-black text-white">Q{order.orderTotal?.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
             </Card>
          </TabsContent>

          {/* INVENTARIO */}
          <TabsContent value="inventario" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mx-auto max-w-4xl space-y-8 text-center pt-10">
               <div className="flex flex-col items-center">
                  <Package className="h-16 w-16 text-red-600 mb-4" />
                  <h2 className="text-3xl font-bold mb-4">Exportador de Inventario</h2>
                  <p className="text-zinc-400 max-w-lg mx-auto mb-8">
                    Genera documentos oficiales en PDF con el stock actual, alertas de agotados y valoración comercial detallada por categoría.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mb-12">
                     <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Stock General</p>
                        <h3 className="text-4xl font-black text-white">{products.reduce((acc, p) => acc + (p.options?.values.reduce((a, v) => a + v.stock, 0) || 0), 0)}</h3>
                        <p className="text-zinc-500 text-xs mt-2">Unidades físicas</p>
                     </div>
                     <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl">
                        <p className="text-zinc-500 text-xs uppercase font-bold mb-1">Categorías Activas</p>
                        <h3 className="text-4xl font-black text-white">{categories.length}</h3>
                        <p className="text-zinc-500 text-xs mt-2">Distribución lógica</p>
                     </div>
                  </div>

                  <Button 
                    onClick={generatePdf} 
                    className="group bg-red-700 hover:bg-red-600 text-white py-10 px-12 rounded-3xl text-xl font-black shadow-[0_20px_50px_rgba(255,0,0,0.3)] transition-all active:scale-95 flex items-center gap-4"
                  >
                    <FileDown className="h-8 w-8 group-hover:animate-bounce" />
                    GENERAR REPORTE PDF PROFESIONAL
                  </Button>
               </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
