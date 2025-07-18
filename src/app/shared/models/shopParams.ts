export class ShopParams {
  brands: string[] = [];
  types: string[] = [];
  sort: string = 'name';
  pageIndex: number = 0;
  pageSize: number = 20;

//   constructor(
//     brands?: string[],
//     types?: string[],
//     sort?: string,
//     pageIndex?: number,
//     pageSize?: number
//   ) {
//     if (brands) this.brands = brands;
//     if (types) this.types = types;
//     if (sort) this.sort = sort;
//     if (pageIndex !== undefined) this.pageIndex = pageIndex;
//     if (pageSize !== undefined) this.pageSize = pageSize;
//   }
}