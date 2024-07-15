/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { GetPoll } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { MdOutlineFileDownload } from "react-icons/md";
import { IoIosShareAlt } from "react-icons/io";
import {toPng} from "html-to-image";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';


import toast from "react-hot-toast";
const baseApiUrl = import.meta.env.VITE_API_BASEURL
const PollPage = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [pollData, setPollData] = useState<any>(null); // State to hold poll data
  const { id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState<Socket | null>(null);
  const pollRef = useRef<HTMLDivElement>(null);
  const [takingScreenshot,setTakingScreenshot] = useState<boolean>(false)
  useEffect(() => {
    const newSocket = io(baseApiUrl);
    setSocket(newSocket);

    newSocket.on('poll-updated', (updatedPollData) => {
      // Update poll data in state when 'poll-updated' event is received
      setPollData(updatedPollData.poll);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Fetch poll data from backend
    const fetchPollData = async () => {
      try {
        const response = await GetPoll(id);
        if (response && response.status >= 200) {
            setPollData(response.data);
        }
      } catch (error: any) {
        if (error.response.status === 404 || error.response.status>=300) setPollData(404);
        console.error("Error fetching poll data:", error);
      }
    };

    fetchPollData();
  }, [id]);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (selectedOption !== null && pollData) {
      const hasVoted = localStorage.getItem(`poll_${pollData._id}`);
      if (hasVoted) {
        toast.error("You Have Already Voted!", { id: 'voted' });
        setSelectedOption(null);
        return;
      }

      try {
        // Emit 'vote' event to server
        socket?.emit("vote", { pollId: pollData._id, option: selectedOption });

        // Mark the poll as voted in localStorage
        localStorage.setItem(`poll_${pollData._id}`, "voted");
        toast.success("Vote submitted successfully!")
        // Clear selected option after voting
        setSelectedOption(null);
      } catch (error) {
        console.error("Error submitting vote:", error);
      }
    } else {
      console.warn("Please select an option.");
    }

  };
  
  const handleSharePoll = () => {
    
    const pollUrl = window.location.href;
  
    navigator.clipboard.writeText(pollUrl)
      .then(() => {
        toast.success("Poll URL copied to clipboard!",{id:"Copy"});
      })
      .catch((error) => {
        console.error("Error copying to clipboard:", error);
        toast.error("Failed to copy poll URL to clipboard.");
      });
  };

  const handleDownload = ()=>{
    setTakingScreenshot(true)
    toast.loading("Downloading results...", {id:"downloadStatus"});
    setTimeout(async ()=>{
      if (pollRef.current) {
        toPng(pollRef.current,{backgroundColor:"rgb(17 24 39)"})
          .then((dataUrl) => {
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `${question}.png`;
            link.click();
            setTakingScreenshot(false)
            toast.success("Downloaded results!",{id:"downloadStatus"});
          })
          .catch((error) => {
            console.error('Error capturing image:', error);
            setTakingScreenshot(false)
            toast.error("Failed to download result")
          });
      }
    },100)

  }

  if (!pollData) {
    return (
      <div className="w-[90%] md:w-1/2 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] p-6 bg-gray-900 rounded-lg flex flex-col justify-center items-center space-y-4" ref={pollRef}>
        <Skeleton width={250} height={40} borderRadius={8} baseColor="#4b0082" highlightColor="#1a1a1a" />
        <div className="w-full space-y-3">
          <Skeleton height={40} borderRadius={8} baseColor="#4b0082" highlightColor="#a243e8" />
          <Skeleton height={40} borderRadius={8} baseColor="#4b0082" highlightColor="#a243e8" />
        </div>
        <div className="w-full">
        <Skeleton height={40} borderRadius={8} baseColor="#4b0082" highlightColor="#a243e8" />
        </div>
        <div className="w-full flex justify-between items-center space-x-3 ">
          <div className="flex space-x-2">
          <Skeleton height={50} width={50} borderRadius={8} baseColor="#4b0082" highlightColor="#a243e8" />
          <Skeleton height={50} width={50} borderRadius={8} baseColor="#4b0082" highlightColor="#a243e8" />
          </div>
          <Skeleton  width={100} borderRadius={3} baseColor="#4b0082" highlightColor="#a243e8" />
        </div>
        
      </div>
    );
}





  const { question, options } = pollData;

  return (
    <div className="w-[80%] md:w-1/2 shadow-[0_10px_20px_rgba(240,_46,_170,_0.7)] p-6 bg-gray-900 rounded-lg"  ref={pollRef}>
      {pollData !== 404 ? (
        <>
          <div className="flex flex-col items-center justify-center mb-4">
            <h1
              className="font-Poppins text-xl md:text-3xl text-purple-500 font-normal"
              style={{ textShadow: "#C084FC 0.5px 0 10px" }}
            >
              {question}
            </h1>
          </div>
          <div className="flex flex-col justify-center">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-3">
                  {options.map((option: any) => (
                    <motion.div
                      key={option._id}
                      className={`flex items-center space-x-2 bg-gray-800 border-2 border-purple-400 md:rounded-lg rounded-md px-1 ${
                        selectedOption === option.option
                          ? "ring-2 ring-purple-500 bg-purple-500"
                          : ""
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleOptionSelect(option.option)}
                    >
                      <input
                        type="radio"
                        id={`option${option._id}`}
                        name="pollOption"
                        className="sr-only"
                        checked={selectedOption === option._id}
                        onChange={() => handleOptionSelect(option.option)}
                      />
                      <label
                        htmlFor={`option${option.option}`}
                        className="flex-1 p-1 md:p-2 text-gray-300 bg-inherit focus:outline-none placeholder-gray-500 cursor-pointer font-Poppins"
                      >
                        {option.option} <span className="text-white">({option.votes} votes)</span>
                      </label>
                    </motion.div>
                  ))}
                </div>
                {!takingScreenshot && <button
                  type="submit"
                  className={`w-full p-2 mt-3 font-Poppins text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50 ${
                    selectedOption === null
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  disabled={selectedOption === null}
                >
                  Submit
                </button>}
              </div>
            </form>
           {!takingScreenshot && <div className="w-full flex mt-5 justify-between items-center font-Poppins">
              <div className="flex justify-center items-center space-x-3">
              <button
                  className="border border-purple-600 font-semibold text-white text-xs md:text-base hover:scale-110 ease-out hover:border-purple-700 transition-all duration-100 focus:outline-none p-2 rounded-md flex justify-center items-center "
                  onClick={handleDownload}
                >
                <MdOutlineFileDownload color="#9333EA"  size={24} />
                </button>
              <button
                  className="border border-purple-600 font-semibold text-white text-xs md:text-base hover:scale-110 ease-out hover:border-purple-700 transition-all duration-100 focus:outline-none p-2 rounded-md flex justify-center items-center "
                  onClick={handleSharePoll}
                >
                <IoIosShareAlt color="#9333EA"  size={24} />
                </button>
              </div>
                <button
                  className="text-purple-500 text-xs md:text-base hover:underline focus:outline-none"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  Create Your Own Poll
                </button>
              </div>}
              {takingScreenshot && <div className="flex font-semibold text-lg justify-end mt-4 text-purple-500 font-Quicksand">
                <p>pollzt.vercel.app</p>
                </div>}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full space-y-3">
          <h1 className="text-xl md:text-3xl font-Poppins text-slate-400">
            No Poll Found!
          </h1>
          <p className="font-Quicksand text-base text-gray-400">
            Please check the URL or{" "}
            <button
              className="text-purple-500 text-base hover:underline focus:outline-none"
              onClick={() => {
                navigate("/");
              }}
            >
              Create Your Own Poll.
            </button>
          </p>
        </div>
      )}
    </div>
  );
};

export default PollPage;
