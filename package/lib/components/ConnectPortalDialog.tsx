import * as React from "react";
import { Description, DialogTitle, Field, Input } from "@headlessui/react";
import { clsx } from "clsx/lite";

import { PlainDialog } from "./PlainDialog";
import { CosmostationIcon } from "./CosmostationIcon";
import { KeplrIcon } from "./KeplrIcon";
import { LikeCoinLogo } from "./LikeCoinLogo";
import { MailIcon } from "./MailIcon";
import { MetamaskIcon } from "./MetamaskIcon";
import { RabbyIcon } from "./RabbyIcon";

export interface ConnectPortalDialogProps {
  providers?: { id: string; name: string }[];
  isOpen?: boolean;
  logoURL?: string;
  logoSize?: number;
  onConnect?: (id: string, payload?: { email: string }) => void;
  onClose?: () => void;
}

export const ConnectPortalDialog: React.FC<ConnectPortalDialogProps> = (
  props
) => {
  const [email, setEmail] = React.useState("");

  function handleClose() {
    props.onClose?.();
    setEmail("");
  }

  function connectWith(id: string) {
    if (id === "email" && !email) {
      return;
    }
    props.onConnect?.(id, { email });
  }

  const logoStyle = {
    maxWidth: `${
      (Number.isNaN(props.logoSize) ? undefined : props.logoSize) || 100
    }px`,
  };
  return (
    <PlainDialog isOpen={props.isOpen} onClose={handleClose}>
      {props.logoURL !== "" &&
        (props.logoURL ? (
          <img src={props.logoURL} style={logoStyle} />
        ) : (
          <LikeCoinLogo className="lk-text-likecoin-500" style={logoStyle} />
        ))}

      <DialogTitle
        as="h3"
        className="lk-mt-[52px] first:lk-mt-0 lk-text-2xl lk-font-bold lk-text-likecoin-500"
      >
        EVM Connect Portal
      </DialogTitle>

      <div>
        <Field className="lk-mt-6">
          <Input
            className="lk-block lk-w-full lk-rounded-lg lk-border-none lk-bg-black/5 lk-py-1.5 lk-px-3 lk-text-sm/6 lk-text-black lk-focus:outline-none lk-data-[focus]:outline-2 lk-data-[focus]:-outline-offset-2 lk-data-[focus]:outline-black/25"
            value={email}
            type="email"
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <button
          className={clsx(
            "lk-flex lk-items-center lk-mt-2 lk-w-full lk-bg-likecoin-500 lk-rounded-lg lk-min-h-[44px] lk-px-3 lk-py-2 lk-text-sm lk-font-medium",
            !!email && "lk-hover:bg-likecoin-700 lk-hover:text-white",
            email ? "lk-text-white" : "lk-text-likecoin-300"
          )}
          disabled={!email}
          onClick={() => connectWith("email")}
        >
          <MailIcon width="20" height="20" />

          <span className="lk-grow lk-mr-[20px]">Continue with Email</span>
        </button>
      </div>

      {props.providers?.length && (
        <div className="lk-mt-4">
          <Description
            as="div"
            className="lk-flex lk-items-center lk-gap-[8px] lk-text-sm/6 lk-text-center lk-text-gray-500"
          >
            <hr className="lk-grow lk-border-gray-600" />
            or
            <hr className="lk-grow lk-border-gray-600" />
          </Description>
          <ul className="lk-flex lk-items-center lk-flex-col lk-gap-2 lk-mt-4 lk-w-full">
            {props.providers?.map(({ id, name }) => (
              <li key={id} className="lk-w-full">
                <button
                  className="lk-flex lk-items-center lk-w-full lk-text-gray-900 lk-bg-gray-100 hover:lk-bg-gray-200 lk-rounded-lg lk-min-h-[44px] lk-px-3 lk-py-2 lk-text-sm lk-font-medium lk-border lk-border-gray-300"
                  onClick={() => connectWith(id)}
                >
                  {id === "io.cosmostation" && <CosmostationIcon />}
                  {id === "io.metamask" && <MetamaskIcon />}
                  {id === "app.keplr" && <KeplrIcon />}
                  {id === "io.rabby" && <RabbyIcon />}
                  <span className="lk-grow lk-mr-[20px] first:lk-mr-0">
                    {name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PlainDialog>
  );
};
