import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-b-4 border-primary-active active:not-aria-[haspopup]:translate-y-1 active:not-aria-[haspopup]:border-b-0 hover:bg-primary/90",
        outline:
          "border-2 border-input bg-background hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-1",
        secondary:
          "bg-secondary text-secondary-foreground border-b-4 border-secondary-foreground/20 active:not-aria-[haspopup]:translate-y-1 active:not-aria-[haspopup]:border-b-0 hover:bg-secondary/80",
        ghost:
          "hover:bg-muted hover:text-foreground active:not-aria-[haspopup]:translate-y-1",
        destructive:
          "bg-destructive text-destructive-foreground border-b-4 border-destructive/70 active:not-aria-[haspopup]:translate-y-1 active:not-aria-[haspopup]:border-b-0 hover:bg-destructive/90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-12 gap-2 px-6 rounded-2xl has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 text-base",
        xs: "h-8 gap-1 rounded-xl px-3 text-xs",
        sm: "h-10 gap-1.5 rounded-xl px-4 text-sm",
        lg: "h-14 gap-2 px-8 rounded-2xl text-lg",
        icon: "size-12 rounded-2xl",
        "icon-xs":
          "size-8 rounded-xl",
        "icon-sm":
          "size-10 rounded-xl",
        "icon-lg": "size-14 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
