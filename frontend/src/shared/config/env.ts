export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1',
  wsBaseUrl: import.meta.env.VITE_WS_BASE_URL || 'ws://localhost:8000',
  siteUrl: import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
  
  getWebSocketUrl: (path: string) => {
    if (config.wsBaseUrl) {
      return `${config.wsBaseUrl}${path}`;
    } else {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      return `${protocol}//${host}${path}`;
    }
  }
};

