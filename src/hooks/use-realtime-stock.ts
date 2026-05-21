import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/stores/cart-store';

export function useRealtimeStock() {
  const updateVariantStock = useCartStore((state) => state.updateVariantStock);

  useEffect(() => {
    // Subscribe to changes in the product_variants table
    const channel = supabase
      .channel('realtime-stock-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to INSERT, UPDATE, etc.
          schema: 'public',
          table: 'product_variants',
        },
        (payload) => {
          const newRow = payload.new as any;
          if (newRow) {
            updateVariantStock(
              newRow.product_id,
              newRow.option_value,
              newRow.stock,
              newRow.color_name || undefined
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [updateVariantStock]);
}
