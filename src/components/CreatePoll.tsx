import React, { useState } from "react";
import { Poll } from "../Interfaces/Poll";
import { CreatePollApi } from "../services/api";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CreatePoll: React.FC = () => {
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [question, setQuestion] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // Loading state
  const navigate = useNavigate()
  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const Poll: Poll = { question: question, options: options };
    const toastId = toast.loading("Creating poll...");
    try {
      const response = await CreatePollApi(Poll);
      if (response && response.status === 201) {
        toast.success("Poll Created!", { id: toastId });
        const pollId:string = response.data.poll._id
        navigate(`/poll/${pollId}`)
      } else {
        toast.error("Failed to create poll", { id: toastId });
      }
    } catch (error) {
      console.error("Error creating poll:", error);
      toast.error("Failed to create poll", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-[80%] md:w-1/2 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] p-6 bg-gray-900 rounded-lg">
      <div className="flex flex-col items-center justify-center mb-4">
        <h1
          className="font-Poppins text-2xl md:text-3xl text-purple-500 font-normal"
          style={{ textShadow: "#C084FC 0.5px 0 10px" }}
        >
          Make a Poll
        </h1>
      </div>
      <div className="flex flex-col justify-center">
        <form action="post" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <p className="text-white font-Poppins text-base md:text-lg">
              What's the question?
            </p>
            <input
              type="text"
              className="w-full p-2 text-gray-300 bg-gray-800 border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-500 placeholder-gray-500"
              placeholder="Your favorite emoji?"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuestion(e.target.value);
              }}
              required
            />
            <p className="text-white font-Poppins text-base md:text-lg">
              Options:
            </p>
            <div className="space-y-3">
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 bg-gray-800 border-2 border-purple-400 rounded-lg px-1"
                    initial={{ opacity: 0, y: "20px" }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      className="flex-1 p-2 text-gray-300 bg-inherit focus:outline-none placeholder-gray-500"
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) =>
                        handleOptionChange(index, e.target.value)
                      }
                      required
                    />
                    {index >= 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(index)}
                        className="text-red-500 hover:text-red-600 rounded-full h-8 w-8 flex items-center justify-center focus:outline-none font-Poppins"
                      >
                        X
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <AnimatePresence>
              {options.length < 4 && (
                <motion.button
                  type="button"
                  onClick={handleAddOption}
                  className="w-full p-2 mt-3 font-Poppins text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
                  initial={{ opacity: 0, y: "20px" }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  + Add Option
                </motion.button>
              )}
            </AnimatePresence>
            <button
              type="submit"
              className={`w-full p-2 mt-3 font-Poppins text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePoll;
