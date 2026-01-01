'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LogOut, FileDown } from 'lucide-react';

import { useCartStore } from '@/stores/cart-store';
import type { Product, ProductOption } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminPage() {
  const { products } = useCartStore((state) => ({
    products: state.products,
  }));
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = (data: LoginFormValues) => {
    if (data.username === 'admin' && data.password === 'Ordinalzonafit22') {
      setIsAuthenticated(true);
      toast({ title: '¡Bienvenido!', description: 'Has iniciado sesión correctamente.' });
    } else {
      toast({
        title: 'Error de autenticación',
        description: 'Usuario o contraseña incorrectos.',
        variant: 'destructive',
      });
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    toast({ title: 'Sesión cerrada', description: 'Has cerrado sesión correctamente.' });
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    const tableColumn = ["ID", "Producto", "Color", "Talla/Opción", "Precio", "Stock"];
    const availableRows: (string | number)[][] = [];
    const unavailableRows: (string | number)[][] = [];

    products.forEach(product => {
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
    
    doc.text("Reporte de Inventario - ZONA FIT GT", 14, 15);

    // Tabla de Disponibles
    if (availableRows.length > 0) {
        (doc as any).autoTable({
            head: [tableColumn],
            body: availableRows,
            startY: 20,
            headStyles: { fillColor: [22, 163, 74] }, // Green header
            didDrawPage: (data: any) => {
                // Header for available products
                doc.text("Productos Disponibles", 14, data.cursor.y + 15);
            },
            margin: { top: 30 }
        });
    }

    // Tabla de Agotados
    if (unavailableRows.length > 0) {
        const unavailableStartY = availableRows.length > 0 ? (doc as any).autoTable.previous.finalY + 20 : 20;
        (doc as any).autoTable({
            head: [tableColumn],
            body: unavailableRows,
            startY: unavailableStartY,
            headStyles: { fillColor: [220, 38, 38] }, // Red header
            didDrawPage: (data: any) => {
                // Header for unavailable products
                doc.text("Productos Agotados", 14, data.cursor.y + 15);
            },
            margin: { top: 30 },
            styles: { fillColor: [254, 226, 226] } // Light red for all unavailable rows
        });
    }


    doc.save("reporte_inventario.pdf");
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
          <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4 hover:bg-gray-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Regresar
          </Button>
          <h1 className="text-center text-3xl font-bold">Acceso de Administrador</h1>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Input {...form.register('username')} placeholder="Usuario" className="bg-gray-700 border-gray-600"/>
            {form.formState.errors.username && <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>}
            <Input {...form.register('password')} type="password" placeholder="Contraseña" className="bg-gray-700 border-gray-600"/>
            {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-900 p-8 text-white">
      <Button variant="ghost" onClick={() => router.back()} className="absolute top-4 left-4 hover:bg-gray-700">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Regresar
      </Button>
       <Button variant="ghost" onClick={handleLogout} className="absolute top-4 right-4 hover:bg-gray-700">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold mb-8">Panel de Administración</h1>
        <div className="mx-auto max-w-lg bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Reportes de Inventario</h2>
          <p className="text-gray-400 mb-4">
            Haz clic en el botón para generar un PDF con el estado actual del inventario de todos los productos.
          </p>
          <Button onClick={generatePdf} className="bg-red-600 hover:bg-red-700">
            <FileDown className="mr-2 h-4 w-4" />
            Generar PDF de Inventario
          </Button>
        </div>
      </div>
    </div>
  );
}
