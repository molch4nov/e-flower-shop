"use client";

import React from "react";
import {cn} from "@heroui/react";
import defaultProducts from "./products";
import ProductListItem from "./products-list-item";

export type ProductGridProps = React.HTMLAttributes<HTMLDivElement> & {
  itemClassName?: string;
  products?: any[];
};

const ProductsGrid = React.forwardRef<HTMLDivElement, ProductGridProps>(
  ({itemClassName, className, products, ...props}, ref) => {
    const items = products || defaultProducts;
    return (
      <div
        ref={ref}
        className={cn(
          "grid w-full grid-cols-2 gap-0 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          className,
        )}
        {...props}
      >
        {items.map((product) => (
          <ProductListItem
            key={product.id}
            removeWrapper
            {...product}
            className={cn("w-full snap-start", itemClassName)}
          />
        ))}
      </div>
    );
  },
);

ProductsGrid.displayName = "ProductsGrid";

export default ProductsGrid;
