import { Item } from './model'

export abstract class itemTemp {
  static testItem(id: string): Item {
    return {
      id: Number(id),
      categoryId: 0,
      name: 'testsingleitem',
      description: '',
      thumbnailPath: '',
      thumbnailId: '',
      brand: '',
      stockQty: 5,
      storePriceThb: 20.5,
      releaseYear: 2015,
    }
  }

  static testItems(): Item[] {
    return [
      {
        id: 0,
        categoryId: 0,
        name: 'testsingleitem',
        description: '',
        thumbnailPath: '',
        thumbnailId: '',
        brand: '',
        stockQty: 5,
        storePriceThb: 20.5,
        releaseYear: 2015,
      },
      {
        id: 1,
        categoryId: 0,
        name: 'testsingleitem',
        description: '',
        thumbnailPath: '',
        thumbnailId: '',
        brand: '',
        stockQty: 5,
        storePriceThb: 20.5,
        releaseYear: 2015,
      },
    ]
  }
}
