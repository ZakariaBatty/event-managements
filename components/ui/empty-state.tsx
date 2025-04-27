import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center p-6 text-center">
          {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
          <h1 className="text-2xl font-bold mb-2">{title}</h1>
          {description && <p className="text-muted-foreground mb-4">{description}</p>}
          {action && <div className="mt-2">{action}</div>}
        </CardContent>
      </Card>
    </div>
  )
}
