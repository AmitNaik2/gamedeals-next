// @ts-ignore
import appModule from '../dist/server.cjs';

export const config = {
  api: {
    bodyParser: false,
  },
};

// Express app might be exported as default or directly based on esbuild
export default appModule.default || appModule;
