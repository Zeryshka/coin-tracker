export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto flex items-center justify-center py-6 text-sm text-muted-foreground">
        © {new Date().getFullYear()} Coin Tracker. All rights reserved.
      </div>
    </footer>
  );
}
