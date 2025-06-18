export function Footer() {
  return (
    <footer className="bg-card/50 border-t border-border/50 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} EduAssess. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1">
          Empowering Learning Through Assessment.
        </p>
      </div>
    </footer>
  );
}
