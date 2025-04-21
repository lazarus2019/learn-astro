interface ImportMetaEnv {
  readonly ALGOLIA_APP_ID: string;
  readonly ALGOLIA_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
