'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { IPromptPayload } from "@/pages/api/promptPayload";
import Resizer from "react-image-file-resizer";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

export default function Home() {
  const BASE64PREFIX = "data:image/png;base64,";
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [showImage, setshowImage] = useState("invisible");
  const [ReceivedImage, setReceivedImage] = useState("");
  const [ReceivedImageBase64, setReceivedImageBase64] = useState("");

  useEffect(() => {
    initialize();

    return () => {
      if (socket) socket.disconnect();
    }
  }, []);

  async function initialize() {
    await fetch("/api/socket");
    socket = io();

    socket.on("receive-image", (data: any) => {
      setReceivedImage(BASE64PREFIX + data);
      setshowImage("visible");
      setLoading(false);
    });
  }

  function handleSubmit(e: { preventDefault: () => void; }) {
    e.preventDefault();
    let promptPayload: IPromptPayload = {
      prompt: prompt
    }
    socket.emit("send-prompt", promptPayload);
    setLoading(true);
    setshowImage("invisible");
  }

  function handleSubmitImage(e: { preventDefault: () => void; }) {
    e.preventDefault();
    let promptPayload: IPromptPayload = {
      prompt: prompt,
      imageBase64: ReceivedImageBase64
    }
    socket.emit("send-prompt", promptPayload);
    setLoading(true);
    setshowImage("invisible");
  }

  const resizeFile = (file: any) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        512,
        512,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const pickImage = async (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const imageUploaded = URL.createObjectURL(event.target.files[0]);
      setReceivedImage(imageUploaded);
      setshowImage("visible");
      // getBase64(event.target.files[0], (result: any) => {
      //   result = result.split(',')[1];
      //   setReceivedImageBase64(result);
      // });
      let imagebase64: string = (await resizeFile(event.target.files[0])) as string;
      imagebase64 = imagebase64.split(',')[1];
      setReceivedImageBase64(imagebase64);
    }
  };

  const getBase64 = (file: any, cb: any) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        cb(reader.result)
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
  }

  const handleClick = () => {
    hiddenFileInput.current!.click();
  };

  function clear(e: { preventDefault: () => void; }) {
    e.preventDefault();
    setPrompt("");
    setshowImage("invisible");
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative z-[-1] flex place-items-center before:absolute before:h-[10px] before:w-full before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-gray-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-gray-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 sm:before:w-[480px] sm:after:w-[240px] before:lg:h-[360px]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>
     <br/>
        <div className="before:h-[100px]">
        <textarea 
          placeholder="Enter your prompts"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
          rows={5}
          className="shadow appearance-none border border-gray-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
        />
          

      <div className="inline-flex rounded-md shadow-sm" role="group">
          <button type="button" disabled={loading} onClick={handleSubmit} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700">
          Text2Image
        </button>
        <input type="file"
                  ref={hiddenFileInput}
                  onChange={pickImage}
                  accept="image/*"
                  style={{ display: 'none' }} />
        <button type="button" onClick={handleClick} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700">
          PickImage
        </button>
        <button type="button" onClick={handleSubmitImage} disabled={loading} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700">
          Image2Image
        </button>
        <button type="button" onClick={clear} className="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:text-white dark:hover:bg-gray-700">
          Clear
        </button>
      </div>

        </div>
      <br />
      <div id="gen_imagebox" className="p-3 mb-2 bg-body-tertiary rounded-3 text-center border">
         
      <span id="text2image_button_icon" hidden={!loading}><svg aria-hidden="true" className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg></span>
        {ReceivedImage && (<Image id="genimage" width={520} height={500} className={showImage} alt="" src={ReceivedImage} />)}
			</div>
      <br />
        <label className="text-sm text-gray-900 dark:text-white">Powered by stability.stable-diffusion 2024</label>
        <br/>
    </main>
  );
}
