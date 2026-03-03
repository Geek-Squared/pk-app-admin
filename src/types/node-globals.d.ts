// Temporary compatibility shim for zone.js typings when using latest Node types.
declare global {
  namespace NodeJS {
    interface Global {
      // Extend as needed to satisfy libraries expecting NodeJS.Global
    }
  }
}

export {};
