
import json
import os

def enrich_product(product):
    name = product.get('name', '').upper()
    cat = product.get('category', '').lower()
    sub = product.get('subcategory', '').lower()
    brand = product.get('brand', '').lower()

    # Default logic for features if not present or too short/basic
    def is_basic(feat):
        if not feat: return True
        if len(feat) < 5: return True
        if feat.lower() in ['guía.', 'oro.', 'brillo.', 'ropa.', 'gym.', 'fit.', 'guía', 'oro', 'brillo']: return True
        return False

    # Descriptions
    if cat == 'ropa':
        if 'COMPRESSION' in name or product.get('is_compression'):
            product['description'] = "Camiseta de compresión técnica diseñada para mejorar el rendimiento muscular y la recuperación. Su tejido ultra-elástico de 4 vías ofrece soporte estratégico y transpirabilidad superior."
            product['feature1'] = "Compresión Graduada de Alto Soporte"
            product['feature2'] = "Tejido Tecnológico de Secado Rápido"
            product['feature3'] = "Costuras Planas Ergonómicas Anti-Fricción"
            product['feature4'] = "Propiedades Antimicrobianas Permanentes"
        elif 'SHORT' in name or sub == 'short':
            product['description'] = "Shorts deportivos ligeros y resistentes con tecnología de secado rápido. Diseñados para ofrecer total libertad de movimiento y comodidad absoluta en tus sesiones más intensas."
            product['feature1'] = "Cintura Elástica de Ajuste Seguro"
            product['feature2'] = "Tejido de Microfibra Ultra Ligera"
            product['feature3'] = "Bolsillos Laterales Reforzados"
            product['feature4'] = "Aperturas Laterales para Movilidad"
        elif 'JOGGER' in name or 'PANT' in name or sub == 'pantalon':
            product['description'] = "Pantalones deportivos con corte cónico moderno y tejido premium que mantiene su forma. Ofrecen suavidad y resistencia superior tanto para entrenar como para un look casual."
            product['feature1'] = "Corte Cónico de Estética Moderna"
            product['feature2'] = "Mezcla de Algodón y Poliéster de Lujo"
            product['feature3'] = "Puños Acanalados de Alta Resistencia"
            product['feature4'] = "Cordones Ajustables con Puntas Metálicas"
        else:
            product['description'] = "Prenda de alto rendimiento con tecnología de gestión de humedad. Su diseño ergonómico y materiales premium garantizan frescura y confort total durante entrenamientos exigentes."
            product['feature1'] = "Tejido Transpirable de Alto Rendimiento"
            product['feature2'] = "Ajuste Atlético que Realza la Figura"
            product['feature3'] = "Material Resistente a la Deformación"
            product['feature4'] = "Tecnología de Gestión de Humedad"

    elif cat == 'joyeria':
        is_gold = 'GOLD' in name or name.endswith('G') or '-G' in name or any('gold' in img.get('src', '').lower() for img in product.get('images', []))
        product['description'] = f"Accesorio exclusivo forjado en acero inoxidable quirúrgico {'con baño de oro de 14K' if is_gold else 'con acabado pulido'}. Resistente al agua y al sudor, perfecto para entrenar con elegancia."
        product['feature1'] = "Baño de Oro de 14K" if is_gold else "Acero Inoxidable 316L"
        product['feature2'] = "Resistencia Total al Agua y Sudor"
        product['feature3'] = "Material Hipoalergénico"
        product['feature4'] = "Acabado Pulido de Alta Durabilidad"

    elif cat == 'suplemento':
        product['description'] = "Fórmula avanzada de pureza garantizada para maximizar fuerza, potencia y recuperación. Ingredientes de grado farmacéutico diseñados para resultados reales sin rellenos innecesarios."
        product['feature1'] = "Pureza Micronizada de Grado Superior"
        product['feature2'] = "Máxima Absorción Intracelular"
        product['feature3'] = "Libre de Azúcares y Rellenos"
        product['feature4'] = "Sabor y Mezclabilidad de Nivel Pro"

    return product

def main():
    file_path = '/Users/francisco/Documents/proyectos/zonaf/src/lib/products.json'
    with open(file_path, 'r', encoding='utf-8') as f:
        products = json.load(f)

    enriched_products = [enrich_product(p) for p in products]

    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(enriched_products, f, indent=2, ensure_ascii=False)

if __name__ == "__main__":
    main()
