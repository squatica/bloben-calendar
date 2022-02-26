export default {
  findItem: (childId: string, data: any[]): any => {
    for (const item of data) {
      if (item.id === childId) {
        return item;
      }
    }
  },
  findById: (id: string, data: any[]): any => {
    for (const item of data) {
      if (item.id === id) {
        return item;
      }
    }
  },
  filterData: async (listId: string, data: any[]): Promise<any> => {
    const result: any[] = [];

    for (const item of data) {
      if (item.listId === listId) {
        result.push(item);
      }
    }

    return result;
  },
  getParent: (listId: string, data: any[]) => {
    for (const item of data) {
      if (listId === item.id) {
        return item;
      }
    }
  },
};
