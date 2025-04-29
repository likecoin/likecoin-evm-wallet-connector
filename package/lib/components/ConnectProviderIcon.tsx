import React from "react";

import { CosmostationIcon } from "./CosmostationIcon";
import { KeplrIcon } from "./KeplrIcon";
import { MailIcon } from "./MailIcon";
import { MetamaskIcon } from "./MetamaskIcon";
import { RabbyIcon } from "./RabbyIcon";

export function ConnectProviderIcon({
  providerId,
  size = 24,
  ...restProps
}: React.SVGProps<SVGSVGElement> & { providerId: string; size?: number }) {
  const props = { width: size, height: size, ...restProps };
  switch (providerId) {
    case "email":
      return <MailIcon {...props} />;
    case "io.metamask":
      return <MetamaskIcon {...props} />;
    case "app.keplr":
      return <KeplrIcon {...props} />;
    case "io.cosmostation":
      return <CosmostationIcon {...props} />;
    case "io.rabby":
      return <RabbyIcon {...props} />;
    default:
      return <></>;
  }
}
