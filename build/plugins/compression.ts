import type { PluginOption } from 'vite';
import compression from 'vite-plugin-compression';

export function setupCompressionPlugin() {
  return compression({
    algorithm: 'gzip',
    ext: '.gz',
    threshold: 10240,
    deleteOriginFile: false
  }) as PluginOption;
}
