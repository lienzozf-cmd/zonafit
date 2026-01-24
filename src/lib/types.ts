

export type CartItem = {
  id: string;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  option: string;
  color?: string;
};

export type ProductOption = {
  value: string;
  stock: number;
};

export type ProductColor = {
  name: string;
  hex: string;
  imageSrc: string;
  options: {
    type: string;
    values: ProductOption[];
  };
};

export type Product = {
  id: number;
  name: string;
  price: string;
  originalPrice?: string;
  availability: string;
  images: { src: string; alt: string; dataAiHint: string; option?: string; color?: string; }[];
  options: {
    type: string;
    values: ProductOption[];
  };
  description: string;
  gender: 'hombre' | 'mujer' | 'unisex';
  category: 'ropa' | 'suplemento' | 'accesorio' | 'joyeria';
  subcategory: string;
  brand: string;
  fabric_type?: string;
  is_compression?: boolean;
  colors?: ProductColor[];
  feature1?: string;
  feature2?: string;
  feature3?: string;
  benefits?: string;
  servings_info?: string;
  visible?: boolean;
};
