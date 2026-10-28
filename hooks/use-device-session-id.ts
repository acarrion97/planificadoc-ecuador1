import { useEffect, useState } from "react";
import { getDeviceSessionId } from "@/lib/local-cloud-backup";

export function useDeviceSessionId(): string {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    let active = true;
    getDeviceSessionId()
      .then((id) => {
        if (active) setSessionId(id);
      })
      .catch((error: unknown) => {
        console.warn("[session] could not load device session id:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  return sessionId;
}
