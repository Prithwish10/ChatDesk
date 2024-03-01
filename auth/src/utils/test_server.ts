import Server from "../Server";
import { Application } from "express";

let appInstance: Application | undefined;

export async function createApp(): Promise<Application> {
  if (!appInstance) {
    const server = new Server(undefined, null);
    appInstance = (await server.up()) as unknown as Application;
  }
  return appInstance;
}
