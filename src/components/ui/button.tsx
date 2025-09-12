import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-black-500 text-primary-foreground shadow-xs hover:bg-black-500/90',
        disabled:
          'bg-blue-300 text-primary-foreground shadow-xs hover:bg-blue-300/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
        //더보기 plus 버튼
        plus: 'border-1 border-line-200 rounded-full cursor-pointer hover:border-blue-200 hover:bg-blue-200',
        comment: 'font-normal text-base text-black-600 hover:underline',
        //마이페이지 로그아웃버튼
        logout:
          'bg-line-100  text-gray-300 text-lg font-normal cursor-pointer hover:bg-line-200 hover:text-gray-500',
        //마이페이지 달력 필터
        filter: 'bg-background rounded-lg text-xl font-semibold text-gray-200 ',
        //마이페이지 popover
        popover:
          ' cursor-pointer border-4 border-gray-300 bg-white text-xl font-semibold text-gray-200',
        popoveroutline:
          'cursor-pointer border-gray-300 bg-gray-custom  text-xl font-semibold text-gray-200',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        plus: 'px-11 py-4',
        commnet: 'px-1 py-2',
        logout: 'w-[100px] py-2 rounded-full',
        filter: 'px-4 py-2 w-[150px]',
        popover: 'w-[96px] h-[96px] px-3 py-2 rounded-2xl',
        popoveroutline: 'w-[96px] h-[96px] px-3 py-2 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
