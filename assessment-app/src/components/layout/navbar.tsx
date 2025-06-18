
"use client";

import Link from "next/link";
import { Menu, X, Home, BookOpenCheck, UserCircle, ShieldCheck, LogIn, UserPlus, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, MOCK_ADMIN_ID, LOCAL_STORAGE_USER_ID_KEY } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type AuthRole = 'user' | 'admin' | null;

const useAuth = () => {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [authRole, setAuthRole] = useState<AuthRole>(null);

  useEffect(() => {
    const updateAuthState = () => {
      const storedUserId = localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY);
      setCurrentUserId(storedUserId);
      if (storedUserId === MOCK_ADMIN_ID) {
        setAuthRole('admin');
      } else if (storedUserId) {
        setAuthRole('user');
      } else {
        setAuthRole(null);
      }
    };

    updateAuthState(); // Initial check

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === LOCAL_STORAGE_USER_ID_KEY) {
        updateAuthState();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  return { isAuthenticated: !!currentUserId, role: authRole, userId: currentUserId };
};


const iconMap: { [key: string]: React.ElementType } = {
  Home,
  BookOpenCheck,
  UserCircle,
  ShieldCheck,
};

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, role } = useAuth(); // userId removed as it's internal to useAuth
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();


  const handleLogout = () => {
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY);
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    // Trigger storage event manually for immediate effect in useAuth hook
    window.dispatchEvent(new StorageEvent('storage', { key: LOCAL_STORAGE_USER_ID_KEY, newValue: null }));
    router.push('/'); // Redirect to home after logout
    if (isMobileMenuOpen) closeMobileMenu();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  }

  const filteredNavLinks = NAV_LINKS.filter(link => {
    if (link.adminOnly) {
      return isAuthenticated && role === 'admin';
    }
    if (link.href === '/profile') { // Profile link visible if any user is logged in
        return isAuthenticated;
    }
    return true;
  });

  return (
    <nav className="bg-card/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-3xl font-headline font-bold text-primary">
              EduAssess
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {filteredNavLinks.map((link) => {
              const IconComponent = iconMap[link.icon];
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {IconComponent && <IconComponent className="w-5 h-5 mr-2" />}
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {role === 'admin' && (
                  <Link href="/profile">
                    <Button variant="outline" className="text-sm">
                      <UserCircle className="w-5 h-5 mr-2" />
                      Admin Profile
                    </Button>
                  </Link>
                )}
                 {role === 'user' && (
                  <Link href="/profile">
                    <Button variant="outline" className="text-sm">
                      <UserCircle className="w-5 h-5 mr-2" />
                      My Profile
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" className="text-sm" onClick={handleLogout}>
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="text-sm">
                    <LogIn className="w-5 h-5 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="default" className="text-sm bg-primary hover:bg-primary/90 text-primary-foreground">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
              className="text-foreground/80 hover:text-primary"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-card shadow-lg z-40 pb-4">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavLinks.map((link) => {
              const IconComponent = iconMap[link.icon];
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
              <Link
                key={link.label}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors duration-150 ease-in-out",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                {IconComponent && <IconComponent className="w-5 h-5 mr-3" />}
                {link.label}
              </Link>
            );
            })}
          </div>
          <div className="pt-4 pb-3 border-t border-border/50">
             {isAuthenticated ? (
               <>
                <Link href="/profile" onClick={closeMobileMenu} className="flex items-center px-5 py-2 text-base font-medium text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-md">
                  <UserCircle className="w-5 h-5 mr-3" /> {role === 'admin' ? 'Admin Profile' : 'My Profile'}
                </Link>
                <Button variant="ghost" className="w-full justify-start text-base font-medium px-5 py-3 text-foreground/80 hover:text-primary hover:bg-primary/5" onClick={handleLogout}>
                    <LogOut className="w-5 h-5 mr-3" /> Logout
                </Button>
               </>
             ) : (
               <div className="space-y-1 px-2">
                 <Link href="/login" onClick={closeMobileMenu}>
                    <Button variant="outline" className="w-full justify-start text-base py-3">
                        <LogIn className="w-5 h-5 mr-3" /> Login
                    </Button>
                 </Link>
                  <Link href="/signup" onClick={closeMobileMenu}>
                    <Button variant="default" className="w-full justify-start text-base py-3 bg-primary hover:bg-primary/90 text-primary-foreground">
                        <UserPlus className="w-5 h-5 mr-3" /> Sign Up
                    </Button>
                 </Link>
               </div>
             )}
          </div>
        </div>
      )}
    </nav>
  );
}
