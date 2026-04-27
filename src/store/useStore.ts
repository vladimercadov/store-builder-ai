// 1. Actualizamos las categorías para que coincidan con tu negocio
export type AssetCategory = 
  | '1-maniquies' 
  | '2-accesorios' 
  | '3-muebles-pago' 
  | '4-exhibidores';

// ... (resto de interfaces igual)

const mockCatalog: Asset[] = [
  {
    id: 'mnqn-dama-01',
    sku: 'MQ-D01',
    name: 'Maniquí Dama Posición A',
    category: '1-maniquies', // <--- Nueva categoría
    priceCOP: 650000,
    dimensions: '180cm x 60cm',
    anchorType: 'floor',
    stock: 12,
    imageUrl: 'assets/catalog/1-maniquies/dama/frontal.png',
    views: {
      left: 'assets/catalog/1-maniquies/dama/izq.png',
      front: 'assets/catalog/1-maniquies/dama/frontal.png',
      right: 'assets/catalog/1-maniquies/dama/der.png'
    }
  },
  {
    id: 'flauta-01',
    sku: 'AC-F01',
    name: 'Flauta 7 Pernos para Riel',
    category: '2-accesorios', 
    priceCOP: 35000,
    dimensions: '30cm',
    anchorType: 'wall', // Estas van ancladas a la pared/riel
    stock: 50,
    imageUrl: 'assets/catalog/2-accesorios/flauta_frontal.png'
  },
  {
    id: 'pago-01',
    sku: 'MB-P01',
    name: 'Punto de Pago Minimalista L',
    category: '3-muebles-pago',
    priceCOP: 1800000,
    dimensions: '120cm x 60cm x 90cm',
    anchorType: 'floor',
    stock: 3,
    imageUrl: 'assets/catalog/3-muebles-pago/frontal.png'
  }
];
