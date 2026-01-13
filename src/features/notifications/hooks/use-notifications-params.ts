import {useQueryStates} from "nuqs";

import {notificationsParams} from "../params";

export const useNotificationsParams = () => {
  return useQueryStates(notificationsParams);
};
