import * as React from "react";
import { Description, Field, Input } from "@headlessui/react";
import { clsx } from "clsx/lite";

import { PlainDialog } from "./PlainDialog";
import { BookComLogo } from "./BookComLogo";
import { ConnectProviderIcon } from "./ConnectProviderIcon";

export interface ConnectPortalDialogProps {
  providers?: { id: string; name: string }[];
  isOpen?: boolean;
  logoURL?: string;
  logoSize?: number;
  email?: string;
  onConnect?: (id: string, payload?: { email: string }) => void;
  onClose?: () => void;
}

export const ConnectPortalDialog: React.FC<ConnectPortalDialogProps> = (
  props
) => {
  const [email, setEmail] = React.useState(props.email || "");
  React.useEffect(() => {
    if (props.isOpen) {
      setEmail(props.email || "");
    }
  }, [props.email, props.isOpen]);

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

  const [preferredProvider, ...otherProviders] = props.providers || [];
  const isPreferredProviderEmail = preferredProvider?.id === "email";

  const logoStyle = {
    maxWidth: `${
      (Number.isNaN(props.logoSize) ? undefined : props.logoSize) || 44
    }px`,
  };
  return (
    <PlainDialog isOpen={props.isOpen} onClose={handleClose}>
      {props.logoURL !== "" &&
        (props.logoURL ? (
          <img src={props.logoURL} style={logoStyle} />
        ) : (
          <BookComLogo className="lk-mx-auto lk-mt-4" style={logoStyle} />
        ))}

      {preferredProvider && (
        <div className="lk-mt-6">
          {isPreferredProviderEmail && (
            <Field className="lk-mb-2">
              <Input
                className="lk-block lk-w-full lk-rounded-lg lk-border-none lk-bg-black/5 lk-py-1.5 lk-px-3 lk-text-sm/6 lk-text-black lk-focus:outline-none lk-data-[focus]:outline-2 lk-data-[focus]:-outline-offset-2 lk-data-[focus]:outline-black/25"
                value={email}
                type="email"
                placeholder="john@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Field>
          )}

          <button
            className={clsx(
              "lk-flex lk-items-center lk-w-full lk-bg-[#131313] lk-rounded-lg lk-min-h-[32px] lk-px-3 lk-py-2 lk-text-sm lk-font-medium",
              (!isPreferredProviderEmail || !!email) &&
                "lk-hover:bg-likecoin-700 lk-hover:text-white",
              !isPreferredProviderEmail || email
                ? "lk-text-[#50e3c2]"
                : "lk-text-[#50e3c2]/80"
            )}
            disabled={isPreferredProviderEmail && !email}
            onClick={() => connectWith(preferredProvider.id)}
          >
            <ConnectProviderIcon providerId={preferredProvider.id} />

            <span className="lk-grow lk-mr-[20px] first:lk-mr-0">
              {preferredProvider.name}
            </span>
          </button>
        </div>
      )}

      {!!otherProviders?.length && (
        <div className="lk-mt-4">
          <Description
            as="div"
            className="lk-flex lk-items-center lk-gap-[8px] lk-text-sm/6 lk-text-center lk-text-[#a1a1a1]"
          >
            <hr className="lk-grow lk-border-[#e5e5e5]" />
            or
            <hr className="lk-grow lk-border-[#e5e5e5]" />
          </Description>
          <ul className="lk-flex lk-items-center lk-flex-col lk-gap-2 lk-mt-4 lk-w-full">
            {otherProviders.map(({ id, name }) => (
              <li key={id} className="lk-w-full">
                {id === "email" && (
                  <Field className="lk-mb-2">
                    <Input
                      className="lk-block lk-w-full lk-rounded-lg lk-border-none lk-bg-black/5 lk-py-1.5 lk-px-3 lk-text-sm/6 lk-text-black lk-focus:outline-none lk-data-[focus]:outline-2 lk-data-[focus]:-outline-offset-2 lk-data-[focus]:outline-black/25"
                      value={email}
                      type="email"
                      placeholder="john@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                )}

                <button
                  className={clsx(
                    "lk-flex lk-items-center lk-w-full lk-bg-[#f5f5f5] lk-rounded-lg lk-min-h-[32px] lk-px-3 lk-py-2 lk-text-sm lk-font-medium lk-border lk-border-gray-300",
                    id === "email" && !email
                      ? "lk-text-gray-400 lk-cursor-not-allowed"
                      : "lk-text-gray-900 hover:lk-bg-gray-200"
                  )}
                  disabled={id === "email" && !email}
                  onClick={() => connectWith(id)}
                >
                  <ConnectProviderIcon providerId={id} />

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
