import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Header } from '@/widgets/Header/Header';
import { Footer } from '@/widgets/Footer/Footer';
import { SplashScreen } from '@/shared/ui/SplashScreen/SplashScreen';
import { useAuthStore } from '@/entities/user';
import { useEffect, useState } from 'react';
import { useScrollPosition } from '@/shared/hooks/useScrollPosition';
import { useScrollBeyondContent } from '@/shared/hooks/useScrollBeyondContent';


const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export const App = () => {
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const initAuth = useAuthStore((state) => state.init);
  const location = useLocation();
  const isScrolled = useScrollPosition(50);
  
  const isBeyondContent = useScrollBeyondContent();
  const isHomePage = location.pathname === '/';
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  const footerHiddenPaths = ['/login', '/register', '/404'];
  const isFooterAlwaysHidden = footerHiddenPaths.includes(location.pathname);
  
  const activateFooter = !isFooterAlwaysHidden && isBeyondContent;

  return (
    <div className="bg-main-dark text-text-light flex flex-col min-h-screen font-body">
      <ScrollToTop />

      {isHomePage && (
        <div 
          className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 font-heading text-xs uppercase tracking-widest text-text-light transition-opacity duration-300 pointer-events-none ${isScrolled ? 'opacity-0' : 'opacity-40'}`}
        >
          Автор проекта: Клименко Елисей
        </div>
      )}
      <Toaster 
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#2a2a2a',
            color: '#f3e9d2',
            border: '1px solid #b5924f',
          },
          success: {
            iconTheme: {
              primary: '#b5924f',
              secondary: '#211e1e',
            },
          },
          error: {
            iconTheme: {
              primary: '#a12d2d',
              secondary: '#f3e9d2',
            },
          },
        }}
      />
      
      {!isInitialized ? <SplashScreen show={true} /> : (
        <>
          <Header />
          <main className="flex-grow flex flex-col">
            <Outlet />
            {!isFooterAlwaysHidden && (
              <div style={{ height: footerHeight > 0 ? `${footerHeight}px` : '0px' }} className="w-full flex-shrink-0" />
            )}
          </main>
          <Footer isVisible={activateFooter} setFooterHeight={setFooterHeight} />
        </>
      )}
    </div>
  );
};