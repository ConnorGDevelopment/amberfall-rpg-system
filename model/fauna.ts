export interface IFauna<T> {
  data: T,
  ts: string,
  ref: {
    '@ref': {
      collection: {
        '@ref': {
          collection: {
            '@ref': {
              id: 'collections'
            }
          },
          // 'collection name'
          id: string
        }
      },
      // 'actual id'
      id: string
    }
  },
}
