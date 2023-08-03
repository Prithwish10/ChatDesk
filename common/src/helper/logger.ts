import { Logger } from "../utils/Logger";
import config from "../config/config.global";

export const logger = Logger.getInstance(config.servicename);
