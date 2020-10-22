import { logger, region } from "firebase-functions";
import { search } from "./reins";

const { https } = region("asia-northeast1");

export const searchReins = https.onCall(async (data, context) => {
  try {
    logger.debug(data, context.auth);
    const { user, pass, ...rest } = data;
    if (typeof user === "string" && typeof pass === "string") {
      return await search(user, pass, rest);
    } else return {};
  } catch (error) {
    logger.error(error);
    return { error };
  }
});
