interface ToastOptions {
  title?: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning";
  duration?: number;
}

export function useToast() {
  const toast = (options: ToastOptions | string) => {
    // Implementação básica - em uma aplicação real, isso seria conectado a um sistema de notificação
    const message = typeof options === "string" ? options : options.title;
    console.log(`Toast: ${message}`);
  };

  return { toast };
}
