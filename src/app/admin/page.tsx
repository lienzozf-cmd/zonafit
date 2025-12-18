'use client';
import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { produce } from 'immer';

import { useCartStore } from '@/stores/cart-store';
import type { Product, ProductColor, ProductOption } from '@/lib/data';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash, PlusCircle, LogOut } from 'lucide-react';

const loginSchema = z.object({
  username: z.string().min(1, 'El usuario es requerido'),
  password: z.string().min(1, 'La contraseña es requerida'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const productOptionSchema = z.object({
  value: z.string().min(1, 'El valor es requerido'),
  stock: z.preprocess((val) => Number(val), z.number().min(0, 'El stock no puede ser negativo')),
});

const productColorSchema = z.object({
  name: z.string().min(1, 'El nombre del color es requerido'),
  hex: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'El formato de color debe ser #RRGGBB'),
  imageSrc: z.string().min(1, 'La URL de la imagen es requerida'),
  options: z.object({
    type: z.string().min(1, 'El tipo de opción es requerido'),
    values: z.array(productOptionSchema).min(1, 'Se requiere al menos una opción para el color'),
  }),
});

const productSchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'El nombre es requerido'),
  price: z.string().min(1, 'El precio es requerido'),
  originalPrice: z.string().optional(),
  description: z.string().min(1, 'La descripción es requerida'),
  gender: z.enum(['hombre', 'mujer', 'unisex']),
  category: z.enum(['ropa', 'suplemento', 'accesorio', 'joyeria']),
  subcategory: z.string().min(1, 'La subcategoría es requerida'),
  brand: z.string().min(1, 'La marca es requerida'),
  fabric_type: z.string().optional(),
  is_compression: z.boolean().optional(),
  benefits: z.string().optional(),
  servings_info: z.string().optional(),
  feature1: z.string().optional(),
  feature2: z.string().optional(),
  feature3: z.string().optional(),
  images: z.array(z.object({
    src: z.string().min(1, 'La URL es requerida'),
    alt: z.string().min(1, 'El texto alternativo es requerido'),
    dataAiHint: z.string().min(1, 'La pista de IA es requerida'),
    color: z.string().optional(),
    option: z.string().optional(),
  })).min(1, 'Se requiere al menos una imagen'),
  options: z.object({
    type: z.string().min(1, 'El tipo de opción es requerido'),
    values: z.array(productOptionSchema),
  }),
  colors: z.array(productColorSchema).optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

export default function AdminPage() {
  const { products, setProducts } = useCartStore((state) => ({
    products: state.products,
    setProducts: state.setProducts,
  }));
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editableProducts, setEditableProducts] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);

  useEffect(() => {
    setEditableProducts(JSON.parse(JSON.stringify(products)));
  }, [products]);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onLoginSubmit = (data: LoginFormValues) => {
    if (data.username === 'admin' && data.password === 'ordinalzonafit22') {
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
    toast({ title: 'Has cerrado sesión.' });
  };
  
  const handleStockChange = (productId: number, optionValue: string, newStock: number, colorName?: string) => {
    setEditableProducts(
      produce((draft) => {
        const product = draft.find((p) => p.id === productId);
        if (!product) return;
  
        if (colorName && product.colors) {
          const color = product.colors.find((c) => c.name === colorName);
          if (color) {
            const option = color.options.values.find((o) => o.value === optionValue);
            if (option) option.stock = newStock;
          }
        } else if (product.options) {
          const option = product.options.values.find((o) => o.value === optionValue);
          if (option) option.stock = newStock;
        }
      })
    );
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableProducts),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el inventario.');
      }
      
      const updatedProducts = await response.json();
      setProducts(updatedProducts); // Actualiza el store de Zustand

      toast({
        title: '¡Éxito!',
        description: 'El inventario ha sido actualizado correctamente.',
      });
    } catch (error: any) {
      console.error("Error saving products:", error);
      toast({
        title: 'Error al Guardar',
        description: error.message || 'Ocurrió un error al guardar los productos.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderProductRows = (product: Product, productIndex: number) => {
    const isProductEven = productIndex % 2 === 0;

    const rowClasses = isProductEven ? 'bg-white text-black' : 'bg-black text-white';
    const noHoverClasses = 'hover:bg-transparent';

    if (product.colors && product.colors.length > 0) {
        return product.colors.flatMap((color) =>
            color.options.values.map((option, optionIndex) => (
                <TableRow key={`${product.id}-${color.name}-${option.value}`} className={`${rowClasses} ${noHoverClasses}`}>
                    {optionIndex === 0 && (
                        <>
                            <TableCell rowSpan={color.options.values.length} className="align-top font-medium">
                                {product.name}
                            </TableCell>
                            <TableCell rowSpan={color.options.values.length} className="align-top">
                                {color.name}
                            </TableCell>
                        </>
                    )}
                    <TableCell>{option.value}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>
                        <Input
                            type="number"
                            value={option.stock}
                            onChange={(e) => handleStockChange(product.id, option.value, parseInt(e.target.value) || 0, color.name)}
                            className="w-20 bg-gray-200 text-black"
                        />
                    </TableCell>
                </TableRow>
            ))
        );
    } else {
        return product.options.values.map((option, optionIndex) => (
            <TableRow key={`${product.id}-${option.value}`} className={`${rowClasses} ${noHoverClasses}`}>
                {optionIndex === 0 && (
                    <>
                        <TableCell rowSpan={product.options.values.length} className="align-top font-medium">
                            {product.name}
                        </TableCell>
                        <TableCell rowSpan={product.options.values.length} className="align-top">
                            N/A
                        </TableCell>
                    </>
                )}
                <TableCell>{option.value}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                    <Input
                        type="number"
                        value={option.stock}
                        onChange={(e) => handleStockChange(product.id, option.value, parseInt(e.target.value) || 0)}
                        className="w-20 bg-gray-200 text-black"
                    />
                </TableCell>
            </TableRow>
        ));
    }
};

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-800 p-8 shadow-lg">
          <h1 className="text-center text-3xl font-bold">Acceso de Administrador</h1>
          <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
            <Input {...loginForm.register('username')} placeholder="Usuario" className="bg-gray-700 border-gray-600"/>
            {loginForm.formState.errors.username && <p className="text-red-500 text-xs">{loginForm.formState.errors.username.message}</p>}
            <Input {...loginForm.register('password')} type="password" placeholder="Contraseña" className="bg-gray-700 border-gray-600"/>
            {loginForm.formState.errors.password && <p className="text-red-500 text-xs">{loginForm.formState.errors.password.message}</p>}
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={loginForm.formState.isSubmitting}>
              {loginForm.formState.isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Administrador de Productos</h1>
        <div className="flex gap-4">
           <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
            <DialogTrigger asChild>
              <Button>Añadir Producto</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[800px] bg-gray-800 text-white border-gray-700">
               <ProductForm 
                  allProducts={products}
                  onFormSubmit={async (newProductData) => {
                    const newId = Math.max(...editableProducts.map(p => p.id), 0) + 1;
                    const newProduct: Product = { ...newProductData, id: newId, availability: 'Disponible' };

                    setEditableProducts(prev => [...prev, newProduct]);

                    toast({
                      title: 'Producto añadido localmente',
                      description: 'Guarda los cambios para persistir el nuevo producto.',
                    });
                    setIsAddProductDialogOpen(false);
                  }}
               />
            </DialogContent>
          </Dialog>
          <Button onClick={handleSave} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-700 hover:bg-gray-700/50">
              <TableHead className="text-white">Producto</TableHead>
              <TableHead className="text-white">Color</TableHead>
              <TableHead className="text-white">Talla/Opción</TableHead>
              <TableHead className="text-white">Precio</TableHead>
              <TableHead className="text-white">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...editableProducts].sort((a, b) => a.name.localeCompare(b.name)).flatMap(renderProductRows)}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}


function ProductForm({ onFormSubmit, allProducts }: { onFormSubmit: (data: ProductFormValues) => void; allProducts: Product[] }) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: 0, // será reemplazado
      name: '',
      price: '',
      description: '',
      gender: 'unisex',
      category: 'ropa',
      subcategory: '',
      brand: '',
      images: [],
      options: { type: 'talla', values: [{ value: '', stock: 0 }] },
      colors: [],
    },
  });

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({ control: form.control, name: 'images' });
  const { fields: optionFields, append: appendOption, remove: removeOption } = useFieldArray({ control: form.control, name: 'options.values' });
  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({ control: form.control, name: 'colors' });

  const uniqueBrands = [...new Set(allProducts.map(p => p.brand))];
  const uniqueSubcategories = [...new Set(allProducts.map(p => p.subcategory))];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          const src = event.target?.result as string;
          appendImage({
            src: src,
            alt: form.getValues('name') || file.name,
            dataAiHint: 'product image',
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6 max-h-[80vh] overflow-y-auto p-2">
      <DialogHeader>
        <DialogTitle>Añadir Nuevo Producto</DialogTitle>
      </DialogHeader>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input placeholder="Nombre del Producto" {...form.register('name')} />
        <Input placeholder="Precio (ej: Q.123.45)" {...form.register('price')} />
        
        <Select onValueChange={(value) => form.setValue('brand', value)} defaultValue={form.getValues('brand')}>
          <SelectTrigger><SelectValue placeholder="Marca" /></SelectTrigger>
          <SelectContent>{uniqueBrands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
        </Select>

        <Select onValueChange={(value) => form.setValue('subcategory', value)} defaultValue={form.getValues('subcategory')}>
          <SelectTrigger><SelectValue placeholder="Subcategoría" /></SelectTrigger>
          <SelectContent>{uniqueSubcategories.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
        </Select>

         <Select onValueChange={(value) => form.setValue('gender', value as any)} defaultValue={form.getValues('gender')}>
          <SelectTrigger><SelectValue placeholder="Género" /></SelectTrigger>
          <SelectContent><SelectItem value="hombre">Hombre</SelectItem><SelectItem value="mujer">Mujer</SelectItem><SelectItem value="unisex">Unisex</SelectItem></SelectContent>
        </Select>
        <Select onValueChange={(value) => form.setValue('category', value as any)} defaultValue={form.getValues('category')}>
          <SelectTrigger><SelectValue placeholder="Categoría" /></SelectTrigger>
          <SelectContent><SelectItem value="ropa">Ropa</SelectItem><SelectItem value="suplemento">Suplemento</SelectItem><SelectItem value="accesorio">Accesorio</SelectItem><SelectItem value="joyeria">Joyería</SelectItem></SelectContent>
        </Select>
      </div>
      <Textarea placeholder="Descripción" {...form.register('description')} />

      <div className="space-y-2">
        <h3 className="font-semibold">Imágenes</h3>
        <div className="grid grid-cols-3 gap-2">
            {imageFields.map((field, index) => (
                <div key={field.id} className="relative">
                    <img src={field.src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => removeImage(index)}>
                        <Trash className="h-4 w-4"/>
                    </Button>
                </div>
            ))}
        </div>
        <Input id="image-upload" type="file" multiple accept="image/*" onChange={handleFileChange} className="mt-2" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Opciones (si no hay colores)</h3>
        <Input placeholder="Tipo de Opción (ej: talla, sabor)" {...form.register('options.type')} />
        {optionFields.map((field, index) => (
           <div key={field.id} className="flex gap-2 items-center">
             <Input placeholder="Valor (ej: S, M, Chocolate)" {...form.register(`options.values.${index}.value`)} />
             <Input type="number" placeholder="Stock" {...form.register(`options.values.${index}.stock`)} />
             <Button type="button" variant="destructive" size="icon" onClick={() => removeOption(index)}><Trash className="h-4 w-4"/></Button>
           </div>
        ))}
        <Button type="button" onClick={() => appendOption({ value: '', stock: 0 })}>Añadir Opción</Button>
      </div>

      <div className="space-y-2">
         <h3 className="font-semibold">Colores (Opcional)</h3>
         {colorFields.map((field, colorIndex) => (
            <ColorFieldArray key={field.id} colorIndex={colorIndex} control={form.control} removeColor={removeColor} />
         ))}
         <Button type="button" onClick={() => appendColor({ name: '', hex: '', imageSrc: '', options: { type: 'talla', values: [{ value: '', stock: 0 }]}})}>Añadir Color</Button>
      </div>

      <DialogFooter>
        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
        <Button type="submit">Crear Producto</Button>
      </DialogFooter>
    </form>
  );
}

function ColorFieldArray({ colorIndex, control, removeColor }: { colorIndex: number, control: any, removeColor: (index: number) => void }) {
    const { fields: colorOptionFields, append: appendColorOption, remove: removeColorOption } = useFieldArray({
        control,
        name: `colors.${colorIndex}.options.values`
    });

    return (
        <div className="p-4 border border-gray-600 rounded-md space-y-3">
            <div className="flex gap-2 items-center">
                <Input placeholder="Nombre del Color (ej: Negro)" {...control.register(`colors.${colorIndex}.name`)} />
                <Input placeholder="Hex (ej: #000000)" {...control.register(`colors.${colorIndex}.hex`)} />
                <Input placeholder="URL Imagen del Color" {...control.register(`colors.${colorIndex}.imageSrc`)} />
                <Button type="button" variant="destructive" size="icon" onClick={() => removeColor(colorIndex)}><Trash className="h-4 w-4"/></Button>
            </div>
            <Input placeholder="Tipo de Opción (ej: talla)" {...control.register(`colors.${colorIndex}.options.type`)} />
            {colorOptionFields.map((optionField, optionIndex) => (
                <div key={optionField.id} className="flex gap-2 items-center ml-4">
                    <Input placeholder="Valor (ej: S, M)" {...control.register(`colors.${colorIndex}.options.values.${optionIndex}.value`)} />
                    <Input type="number" placeholder="Stock" {...control.register(`colors.${colorIndex}.options.values.${optionIndex}.stock`)} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeColorOption(optionIndex)}><Trash className="h-4 w-4"/></Button>
                </div>
            ))}
            <Button type="button" className="ml-4" onClick={() => appendColorOption({ value: '', stock: 0 })}>Añadir Opción al Color</Button>
        </div>
    )
}
