import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl text-muted-foreground">Страница не найдена</p>
      <Button asChild>
        <Link href="/">Вернуться на главную</Link>
      </Button>
    </div>
  )
}
