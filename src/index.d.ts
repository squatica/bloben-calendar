declare interface Window {
  electron: {
    store: {
      get: (key: string) => any;
      set: (key: string, val: any) => void;
    };
    sync: (type: any, status: any, data: string) => any;
    clear: () => void;
    listen: (key: string, data: any) => any;
    fetch: () => void;
  };
}
