import React, { useState } from "react";
import { useLifecycles } from "react-use";
import { loadScript } from "./utils";

const JitsiMeet = ({ roomName }) => {
  const [jitsi, setJitsi] = useState(null);

  const load = () => {
    return loadScript("https://meet.jit.si/external_api.js", true);
  };

  const initialize = async () => {
    await load();
    const newJitsi = new window.JitsiMeetExternalAPI("meet.jit.si", {
      parentNode: document.getElementById("jitsi-root"),
      roomName,
      userInfo: {
        roomName
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DISPLAY_WELCOME_PAGE_CONTENT: false,
        SHOW_CHROME_EXTENSION_BANNER: false,
        SHOW_POWERED_BY: false,
        SHOW_PROMOTIONAL_CLOSE_PAGE: true
      },
      configOverwrite: {
        disableSimulcast: false,
        enableClosePage: true
      }
    });
    setJitsi(newJitsi);
  };

  const destroy = () => {
    jitsi?.dispose();
  };

  useLifecycles(
    () => initialize(),
    () => destroy()
  );

  return <div id="jitsi-root" style={{ height: 720, width: "100%" }} />;
};

export default JitsiMeet;
