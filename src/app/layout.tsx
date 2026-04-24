import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import '@xyflow/react/dist/style.css';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AGIR - MRS Logística',
  description: 'Sistema de Avaliação de Riscos Operacionais',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.variable} font-sans antialiased text-mrs-blue min-h-screen bg-[#f7f9fa]`}>
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
