import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Integration tests hit a real remote MySQL instance over the network;
    // the default 5s timeout is occasionally too tight for that round trip.
    testTimeout: 15000,
  },
});
