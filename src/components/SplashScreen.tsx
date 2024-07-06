import { motion } from 'framer-motion';
interface propsType{
  showSplash:boolean,
}
function SplashScreen(props:propsType) {
  const {showSplash} = props
  return (
    <motion.div
      className="relative flex flex-col justify-center items-center "
      initial={showSplash ? { y: "40vh", opacity: 0, scale: 0.3 } : { y: 0, paddingTop: "40px", paddingBottom: "24px" }}
      animate={{ y: showSplash ? "40vh" : 0, paddingTop: showSplash ? 0 : "40px", paddingBottom: showSplash ? 0 : "24px", opacity: 1, scale: 1 }}
      transition={{ duration: 1.1, ease:'easeOut' }}
    >
      <h1 className="bg-gradient-to-r from-fuchsia-400 to-blue-300 bg-clip-text text-transparent text-5xl md:text-7xl font-JosefinSans font-[400] tracking-tight">
        PollZ
      </h1>
      <h2 className="text-slate-300 text-lg font-[400] md:text-2xl font-Quicksand">
        Join the Conversation.
      </h2>
    </motion.div>
  );
}

export default SplashScreen;
