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

// Define las categorías y sus filtros
const categories = [
    { name: 'Ropa de Hombre', color: [255, 165, 0], filter: (p: Product) => p.gender === 'hombre' && p.category === 'ropa' },
    { name: 'Ropa de Mujer', color: [255, 105, 180], filter: (p: Product) => p.gender === 'mujer' && p.category === 'ropa' },
    { name: 'Joyería', color: [255, 215, 0], filter: (p: Product) => p.category === 'joyeria' },
    { name: 'Proteínas', color: [138, 43, 226], filter: (p: Product) => p.category === 'suplemento' && p.subcategory === 'proteina' },
    { name: 'Creatinas', color: [0, 191, 255], filter: (p: Product) => p.category === 'suplemento' && p.subcategory === 'creatina' },
    { name: 'Pre-Entrenos', color: [255, 69, 0], filter: (p: Product) => p.category === 'suplemento' && p.subcategory === 'pre-entreno' },
    { name: 'Aminoácidos', color: [50, 205, 50], filter: (p: Product) => p.category === 'suplemento' && p.subcategory === 'aminoacidos' },
    { name: 'L-Carnitina', color: [255, 20, 147], filter: (p: Product) => p.category === 'suplemento' && p.subcategory === 'l-carnitina' },
    { name: 'Accesorios', color: [100, 149, 237], filter: (p: Product) => p.category === 'accesorio' },
];

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
    doc.text("Reporte General de Inventario - ZONA FIT GT", 14, 15);
    let startY = 25;

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

        // Título de la categoría
        doc.setFontSize(16);
        doc.setTextColor(category.color[0], category.color[1], category.color[2]);
        if (startY > 250) { 
            doc.addPage();
            startY = 15;
        }
        doc.text(category.name, 14, startY);
        doc.setTextColor(0, 0, 0);
        startY += 8;

        // Tabla de Disponibles
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
                headStyles: { fillColor: [22, 163, 74] }, // Verde
            });
            startY = (doc as any).autoTable.previous.finalY + 2;
        }

        // Tabla de Agotados
        if (unavailableRows.length > 0) {
            (doc as any).autoTable({
                head: [tableColumn],
                body: unavailableRows,
                startY: startY,
                headStyles: { fillColor: [220, 38, 38] }, // Rojo
                styles: { fillColor: [254, 226, 226] } 
            });
            startY = (doc as any).autoTable.previous.finalY + 2;
        }
        
        if (availableRows.length === 0 && unavailableRows.length === 0) {
          doc.setFontSize(10);
          doc.text("No hay productos en esta categoría.", 14, startY);
          startY += 10;
        }

        startY += 10; // Espacio para la siguiente categoría
    });

    doc.save("reporte_inventario_por_categoria.pdf");
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
       <Button variant="ghost" onClick={handleLogout} className="absolute top-4 right-4 hover:bg-gray-700">
        <LogOut className="mr-2 h-4 w-4" />
        Cerrar Sesión
      </Button>
      <div className="container mx-auto">
        <h1 className="text-center text-3xl font-bold mb-8">Panel de Administración</h1>
        <div className="mx-auto max-w-lg bg-gray-800 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Reportes de Inventario</h2>
          <p className="text-gray-400 mb-4">
            Haz clic en el botón para generar un PDF con el estado actual del inventario, organizado por categorías.
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
