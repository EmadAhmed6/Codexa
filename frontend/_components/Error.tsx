import { CircleAlert } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Text } from "./Text";
export const errorVariants = {
  initial: { y: -10, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -10, opacity: 0 },
};
const Error = ({ error }: { error: string | undefined }) => {
  return (
    <AnimatePresence>
      {error && (
        <motion.div
          key="error-message"
          variants={errorVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{
            ease: "easeInOut",
            duration: 0.2,
            stiffness: 120,
          }}
          className="flex items-center gap-2 text-textError mt-1"
        >
          <CircleAlert className="w-4 h-4 text-textError" />
          <Text as={"span"} font={"medium"} size={"sm"} color={"error"}>
            {error}
          </Text>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Error;
