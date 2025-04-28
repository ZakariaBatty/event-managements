interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-200px)]">
      <div className="text-2xl font-bold">{message}</div>
    </div>
  )
}
