import { Dialog, DialogContent } from "../ui/dialog";

export const ModalContainer = ({ children, isOpen, handleClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {children}
      </DialogContent>
    </Dialog>
  );
};
