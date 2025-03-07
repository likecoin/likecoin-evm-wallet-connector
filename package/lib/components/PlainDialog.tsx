import React from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

export interface PlainDialogProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen?: boolean;
  onClose?: () => void;
}

export const PlainDialog: React.FC<PlainDialogProps> = (props) => {
  function handleClose() {
    props.onClose?.();
  }

  return (
    <Dialog className="relative z-50" open={props.isOpen} onClose={handleClose}>
      <DialogBackdrop className="lk-fixed lk-inset-0 lk-bg-black/30" />

      <div className="lk-fixed lk-inset-0 lk-z-10 lk-w-screen lk-overflow-y-auto">
        <div className="lk-flex lk-min-h-full lk-items-center lk-justify-center lk-p-4">
          <DialogPanel
            transition
            className="lk-w-full lk-max-w-md lk-rounded-xl lk-bg-white/90 lk-p-6 lk-backdrop-blur-2xl lk-duration-300 lk-ease-out lk-data-[closed]:transform-[scale(95%)] lk-data-[closed]:opacity-0"
          >
            {props.children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};
