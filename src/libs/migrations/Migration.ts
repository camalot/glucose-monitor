interface Migration {
  run(): Promise<void>;
}