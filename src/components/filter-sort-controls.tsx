'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

interface FilterSortControlsProps {
  sortOption: string;
  setSortOption: (value: string) => void;
  selectedBrand: string;
  setSelectedBrand: (value: string) => void;
  brands: string[];
  hideBrandFilter?: boolean;
}

const FilterSortControls = ({ 
  sortOption, 
  setSortOption, 
  selectedBrand, 
  setSelectedBrand, 
  brands,
  hideBrandFilter = false
}: FilterSortControlsProps) => {
  return (
    <Collapsible className="mb-8">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="text-white">
            <Filter className="mr-2 h-4 w-4" />
          Filtros y Ordenamiento
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 border border-gray-700 rounded-lg">
          <div>
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-300 mb-2">Ordenar por</label>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger id="sort-select" className="w-full bg-gray-800 border-gray-600 text-white">
                <SelectValue placeholder="Seleccionar opción" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-gray-600">
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!hideBrandFilter && (
            <div>
                <label htmlFor="brand-select" className="block text-sm font-medium text-gray-300 mb-2">Filtrar por Marca</label>
                <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger id="brand-select" className="w-full bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 text-white border-gray-600">
                    <SelectItem value="all">Todas las marcas</SelectItem>
                    {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>{brand}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FilterSortControls;
