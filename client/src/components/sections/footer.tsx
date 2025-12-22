export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border bg-background">
      <div className="container mx-auto text-center">
        <p className="text-muted-foreground text-sm">
          © {new Date().getFullYear()} Vishwanth Reddy. Built with React & Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
